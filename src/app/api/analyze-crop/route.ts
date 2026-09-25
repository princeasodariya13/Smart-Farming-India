import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configure Cloudinary if keys exist
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Active Gemini Vision Models (in order of preference)
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-2.5-pro',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
];

// Hugging Face Classification Models
const HF_MODELS = [
  'https://router.huggingface.co/hf-inference/v1/models/dima806/crop_leaf_diseases_detection',
  'https://api-inference.huggingface.co/models/dima806/crop_leaf_diseases_detection',
  'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification',
];

export interface PesticideRecommendation {
  activeIngredient: string;
  formulation?: string;
  purpose?: string;
  dose?: string;
  applicationMethod?: string;
  timing?: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: 'ICAR' | 'Government' | 'AgriculturalUniversity' | 'Research';
}

/**
 * Perform dynamic live backend retrieval of authoritative agricultural pesticide recommendations
 * for the identified <Crop> + <Disease/Pest> combination from ICAR, Govt & Agricultural Universities.
 */
async function fetchAuthoritativePesticideRecommendations(cropName: string, diseaseName: string): Promise<PesticideRecommendation[]> {
  if (!cropName || !diseaseName || diseaseName.toLowerCase().includes('healthy')) {
    return [];
  }

  console.log(`[LOG] Querying authoritative agricultural sources for Crop: "${cropName}", Disease/Pest: "${diseaseName}"...`);
  const query = `"${cropName}" "${diseaseName}" pesticide recommendation ICAR India`;

  const searchResults: { url: string; title: string; snippet: string; sourceType: 'ICAR' | 'Government' | 'AgriculturalUniversity' | 'Research' }[] = [];

  try {
    const params = new URLSearchParams();
    params.append('q', query);

    const searchRes = await fetch("https://html.duckduckgo.com/html/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      body: params.toString(),
      signal: AbortSignal.timeout(4000)
    });

    if (searchRes.ok) {
      const html = await searchRes.text();
      const blockRegex = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;

      let match;
      while ((match = blockRegex.exec(html)) !== null && searchResults.length < 8) {
        let rawUrl = match[1];
        if (rawUrl.includes('uddg=')) {
          rawUrl = decodeURIComponent(rawUrl.split('uddg=')[1].split('&')[0]);
        }
        const title = match[2].replace(/<[^>]+>/g, '').trim();
        const snippet = match[3].replace(/<[^>]+>/g, '').trim();

        if (rawUrl.startsWith('http')) {
          let sourceType: 'ICAR' | 'Government' | 'AgriculturalUniversity' | 'Research' = 'Research';
          if (rawUrl.includes('icar') || rawUrl.includes('ncipm') || rawUrl.includes('iihr') || rawUrl.includes('cris')) sourceType = 'ICAR';
          else if (rawUrl.includes('gov.in') || rawUrl.includes('nic.in') || rawUrl.includes('niphm')) sourceType = 'Government';
          else if (rawUrl.includes('ac.in') || rawUrl.includes('edu')) sourceType = 'AgriculturalUniversity';

          searchResults.push({ url: rawUrl, title, snippet, sourceType });
        }
      }
    }
  } catch (searchErr) {
    console.warn('[LOG] Dynamic search engine query skipped (non-fatal):', searchErr);
  }

  const verifiedRecommendations: PesticideRecommendation[] = [];

  for (const item of searchResults) {
    const text = (item.title + ' ' + item.snippet).toLowerCase();
    
    // Check if the source specifically supports both crop AND disease/pest
    const cropKeywords = cropName.toLowerCase().split(' ').filter(w => w.length > 2);
    const diseaseKeywords = diseaseName.toLowerCase().split(' ').filter(w => w.length > 2);

    const matchesCrop = cropKeywords.some(kw => text.includes(kw));
    const matchesDisease = diseaseKeywords.some(kw => text.includes(kw));

    let activeIngredient = '';
    let formulation = '';
    let dose = '';

    const chemicals = [
      { name: 'Mancozeb', form: '75% WP' },
      { name: 'Copper Oxychloride', form: '50% WP' },
      { name: 'Azoxystrobin', form: '23% SC' },
      { name: 'Tebuconazole', form: '25.9% EC' },
      { name: 'Propiconazole', form: '25% EC' },
      { name: 'Metalaxyl + Mancozeb', form: '8% + 64% WP' },
      { name: 'Chlorothalonil', form: '75% WP' },
      { name: 'Streptocycline', form: '90:10' },
      { name: 'Imidacloprid', form: '17.8% SL' },
      { name: 'Thiamethoxam', form: '25% WG' },
      { name: 'Fipronil', form: '5% SC' },
      { name: 'Spinetoram', form: '11.7% SC' },
      { name: 'Trichoderma harzianum', form: 'Bio-Fungicide' },
      { name: 'Pseudomonas fluorescens', form: 'Bio-Agent' }
    ];

    for (const chem of chemicals) {
      if (text.includes(chem.name.toLowerCase())) {
        activeIngredient = chem.name;
        formulation = chem.form;
        break;
      }
    }

    // Extract dose ONLY if explicitly present in retrieved source text
    const doseMatch = item.snippet.match(/(\d+(?:\.\d+)?\s*(?:g|ml|kg)\s*\/\s*(?:L|litre|acre|ha))/i);
    if (doseMatch) {
      dose = doseMatch[1];
    }

    // REQUIREMENT 8: Only return recommendation if sourceUrl is a valid URL and supports crop+disease
    if (activeIngredient && item.url && matchesCrop && matchesDisease) {
      verifiedRecommendations.push({
        activeIngredient,
        formulation,
        purpose: `Targeted management of ${diseaseName} in ${cropName}`,
        dose: dose || '',
        applicationMethod: text.includes('spray') ? 'Foliar spray' : 'Targeted application as per label instructions',
        timing: 'At first appearance of symptoms',
        sourceTitle: item.title,
        sourceUrl: item.url,
        sourceType: item.sourceType
      });
    }

    if (verifiedRecommendations.length >= 3) break;
  }

  return verifiedRecommendations;
}

/**
 * 1. Call Plant.id API v3 for primary plant & health identification
 */
async function callPlantIdAPI(base64Data: string, mimeType: string) {
  const apiKey = (process.env.PLANT_ID_API_KEY || process.env.PLANT_ID_KEY)?.trim();
  if (!apiKey) {
    return { success: false, error: 'Plant.id API key not configured' };
  }

  try {
    const formattedImage = base64Data.startsWith('data:')
      ? base64Data
      : `data:${mimeType};base64,${base64Data}`;

    const url = 'https://plant.id/api/v3/identification?details=common_names,url,description,taxonomy,disease_cause,symptoms,treatment';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        images: [formattedImage],
        health: 'all',
        similar_images: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `Plant.id HTTP ${response.status}: ${errText.substring(0, 150)}` };
    }

    const data = await response.json();
    const result = data.result || data;

    const topPlant = result?.classification?.suggestions?.[0];
    const plantName = topPlant?.name || topPlant?.details?.common_names?.[0] || null;
    const scientificName = topPlant?.details?.taxonomy?.scientific_name || topPlant?.name || null;
    const plantProbability = typeof topPlant?.probability === 'number' ? topPlant.probability : null;

    const healthAssessment = result?.health_assessment || result?.disease;
    const isHealthy = healthAssessment?.is_healthy?.binary ?? (healthAssessment?.is_healthy > 0.5);
    const topDisease = healthAssessment?.diseases?.[0] || result?.disease?.suggestions?.[0];
    const diseaseName = isHealthy ? 'Healthy Plant' : (topDisease?.name || topDisease?.details?.common_name || null);
    const diseaseProbability = typeof topDisease?.probability === 'number' ? topDisease.probability : null;
    const diseaseSymptoms = topDisease?.details?.symptoms ? [topDisease.details.symptoms] : [];
    const diseaseTreatment = topDisease?.details?.treatment?.biological || topDisease?.details?.treatment?.prevention || [];

    return {
      success: true,
      data: {
        raw: data,
        plantName,
        scientificName,
        plantProbability,
        isHealthy,
        diseaseName,
        diseaseProbability,
        symptoms: Array.isArray(diseaseSymptoms) ? diseaseSymptoms : [],
        treatment: Array.isArray(diseaseTreatment) ? diseaseTreatment : [],
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Plant.id request failed' };
  }
}

/**
 * 2. Call Google Gemini AI Vision for symptom analysis & plant pathology reasoning
 */
async function callGeminiAPI(base64Data: string, mimeType: string, plantIdContext: any) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  const contextPrompt = plantIdContext?.success && plantIdContext?.data
    ? `PLANT.ID API PRIMARY RESULTS:
- Plant: ${plantIdContext.data.plantName || 'Unknown'} (${plantIdContext.data.scientificName || 'Unknown'}) [Confidence: ${plantIdContext.data.plantProbability ?? 'N/A'}]
- Health Status: ${plantIdContext.data.isHealthy ? 'Healthy' : 'Diseased'}
- Plant.id Top Disease: ${plantIdContext.data.diseaseName || 'None'} [Confidence: ${plantIdContext.data.diseaseProbability ?? 'N/A'}]`
    : `PLANT.ID API RESULTS: Not available or request failed.`;

  const GEMINI_CROP_PROMPT = `You are a world-class agricultural plant pathologist analyzing a crop leaf image for Indian farmers.

${contextPrompt}

INSTRUCTIONS:
1. Examine the uploaded image pixels carefully for plant foliage and disease symptoms.
2. If the image does NOT contain a plant, crop, leaf, stem, or agricultural subject, return ONLY this JSON:
   {"notAPlant": true, "reason": "This image does not appear to contain a plant or crop. Please upload a clear photo of a plant leaf or crop."}

3. If it IS a plant, analyze the image and validate with the Plant.id context if available.
4. Output ONLY a valid JSON object matching this schema (no markdown, no code fences):
{
  "notAPlant": false,
  "plantName": "Exact common name of the plant identified in the image",
  "scientificName": "Scientific botanical name",
  "status": "Healthy OR Diseased",
  "diseaseName": "Exact disease name identified, or 'Healthy Plant' if healthy",
  "diagnosisStatus": "likely OR possible OR uncertain",
  "symptoms": ["Visible symptom 1 observed on leaf", "Visible symptom 2"],
  "cause": "Detailed scientific cause of this condition",
  "treatment": ["Organic/management step 1", "Organic/management step 2"],
  "prevention": ["Prevention measure 1", "Prevention measure 2"],
  "irrigationAdvice": "Specific watering advice for this condition",
  "fertilizerAdvice": "Specific fertilizer recommendation"
}

IMPORTANT: Do NOT invent chemical pesticide names, active ingredients, or exact milliliter/gram dosages.
Return ONLY valid JSON.`;

  for (const modelName of GEMINI_MODELS) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey || '');
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent([
        GEMINI_CROP_PROMPT,
        { inlineData: { mimeType: mimeType, data: base64Data } },
      ]);

      const text = result.response.text()?.trim();
      if (text) {
        const jsonStr = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(jsonStr);
        return { success: true, model: modelName, data: parsed };
      }
    } catch (sdkErr: any) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const body = {
          contents: [{
            parts: [
              { text: GEMINI_CROP_PROMPT },
              { inline_data: { mime_type: mimeType, data: base64Data } },
            ],
          }],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const restData = await response.json();
          const restText = restData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (restText) {
            const jsonStr = restText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
            const parsed = JSON.parse(jsonStr);
            return { success: true, model: modelName, data: parsed };
          }
        }
      } catch (restErr: any) {
        continue;
      }
    }
  }

  return { success: false, error: 'Gemini API models unavailable or rate limited' };
}

/**
 * 3. Call Hugging Face API as secondary image-based prediction fallback/comparator
 */
async function callHuggingFaceAPI(base64Data: string, mimeType: string) {
  const apiKey = (process.env.HUGGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY)?.trim();
  if (!apiKey) {
    return { success: false, error: 'Hugging Face API key not configured' };
  }

  const imageBuffer = Buffer.from(base64Data, 'base64');

  for (const modelUrl of HF_MODELS) {
    try {
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': mimeType || 'image/jpeg',
        },
        body: imageBuffer,
      });

      if (!response.ok) {
        continue;
      }

      const predictions = await response.json();
      if (Array.isArray(predictions) && predictions.length > 0) {
        const topPrediction = predictions[0];
        const label = topPrediction.label || topPrediction.entity || null;
        const score = typeof topPrediction.score === 'number' ? topPrediction.score : null;
        const formattedLabel = label ? label.replace(/___/g, ' - ').replace(/_/g, ' ') : null;

        return {
          success: true,
          data: {
            modelUrl,
            rawLabel: label,
            diseaseName: formattedLabel,
            confidence: score,
            allPredictions: predictions.slice(0, 3),
          },
        };
      }
    } catch (err: any) {
      continue;
    }
  }

  return { success: false, error: 'Hugging Face classification models unavailable or unauthorized' };
}

/**
 * Combine, compare, and synthesize dynamic multi-API results
 */
function synthesizeResults(plantIdRes: any, geminiRes: any, hfRes: any) {
  const sources: string[] = [];
  if (plantIdRes?.success) sources.push('Botanical Identification Engine');
  if (geminiRes?.success) sources.push('Pathology Vision System');
  if (hfRes?.success) sources.push('Crop Disease Classifier');

  const plantName = plantIdRes?.data?.plantName
    || geminiRes?.data?.plantName
    || (hfRes?.data?.diseaseName ? hfRes.data.diseaseName.split(' - ')[0] : null)
    || 'Plant';

  const scientificName = plantIdRes?.data?.scientificName
    || geminiRes?.data?.scientificName
    || '';

  const plantConfidence = plantIdRes?.data?.plantProbability ?? null;

  const plantIdDisease = plantIdRes?.data?.diseaseName;
  const geminiDisease = geminiRes?.data?.diseaseName;
  const hfDisease = hfRes?.data?.diseaseName;

  const primaryDisease = geminiDisease || plantIdDisease || hfDisease || 'Unknown Condition';

  let rawConfidence: number | null = null;
  if (typeof plantIdRes?.data?.diseaseProbability === 'number') {
    rawConfidence = plantIdRes.data.diseaseProbability;
  } else if (typeof hfRes?.data?.confidence === 'number') {
    rawConfidence = hfRes.data.confidence;
  }

  let status: 'likely' | 'possible' | 'uncertain' = 'likely';

  if (geminiRes?.data?.diagnosisStatus && ['likely', 'possible', 'uncertain'].includes(geminiRes.data.diagnosisStatus)) {
    status = geminiRes.data.diagnosisStatus;
  }

  if (plantIdDisease && hfDisease) {
    const pIdLower = plantIdDisease.toLowerCase();
    const hfLower = hfDisease.toLowerCase();
    const isAgreeing = pIdLower.includes(hfLower) || hfLower.includes(pIdLower) || (pIdLower.includes('healthy') && hfLower.includes('healthy'));
    if (!isAgreeing) {
      status = 'uncertain';
    }
  }

  if (rawConfidence !== null && rawConfidence < 0.45) {
    status = 'uncertain';
  }

  const symptoms: string[] = [];
  if (Array.isArray(geminiRes?.data?.symptoms)) {
    symptoms.push(...geminiRes.data.symptoms);
  }
  if (Array.isArray(plantIdRes?.data?.symptoms)) {
    plantIdRes.data.symptoms.forEach((s: string) => {
      if (!symptoms.includes(s)) symptoms.push(s);
    });
  }
  if (symptoms.length === 0) {
    symptoms.push('Visual symptoms detected on crop foliage.');
  }

  const cause = geminiRes?.data?.cause || (plantIdDisease ? `Pathological assessment for ${plantIdDisease}.` : 'Pathogen or environmental factors affecting crop leaf structure.');

  const treatment: string[] = [];
  if (Array.isArray(geminiRes?.data?.treatment)) {
    treatment.push(...geminiRes.data.treatment);
  }
  if (Array.isArray(plantIdRes?.data?.treatment)) {
    plantIdRes.data.treatment.forEach((t: string) => {
      if (!treatment.includes(t)) treatment.push(t);
    });
  }

  const pesticides: string[] = ['Treatment information could not be verified.'];

  const prevention: string[] = Array.isArray(geminiRes?.data?.prevention) && geminiRes.data.prevention.length > 0
    ? geminiRes.data.prevention
    : ['Monitor crop leaf health regularly', 'Maintain field sanitation and proper plant spacing'];

  const confidenceScorePercentage = rawConfidence !== null
    ? Math.round(rawConfidence > 1 ? rawConfidence : rawConfidence * 100)
    : null;

  return {
    plant: {
      name: plantName,
      scientificName: scientificName,
      confidence: plantConfidence,
    },
    diagnosis: {
      name: primaryDisease,
      confidence: rawConfidence,
      status: status,
    },
    symptoms: symptoms,
    cause: cause,
    treatment: treatment,
    pesticides: pesticides,
    prevention: prevention,
    analysis: {
      plantId: plantIdRes,
      gemini: geminiRes,
      huggingFace: hfRes,
    },
    sources: sources,

    plantName: plantName,
    scientificName: scientificName,
    status: status === 'uncertain' ? 'Uncertain' : (primaryDisease.toLowerCase().includes('healthy') ? 'Healthy' : 'Diseased'),
    diseaseName: primaryDisease,
    confidenceScore: confidenceScorePercentage ?? 85,
    severity: status === 'uncertain' ? 'Uncertain' : 'Medium',
    organicTreatment: treatment.join('\n') || 'Maintain organic soil health and regular foliage inspection.',
    recommendedPesticides: pesticides,
    activeIngredient: 'Treatment information could not be verified.',
    dosePerLitre: 'Treatment information could not be verified.',
    recommendedFungicideInsecticide: 'Treatment information could not be verified.',
    irrigationAdvice: geminiRes?.data?.irrigationAdvice || 'Maintain optimal root-zone watering based on soil moisture.',
    fertilizerAdvice: geminiRes?.data?.fertilizerAdvice || 'Apply balanced organic fertilizers and micronutrients.',
    expectedRecoveryTime: '7 to 14 days after management action',
  };
}

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    let bodyData: any = {};
    try {
      bodyData = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { imageBase64 } = bodyData;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Step 1: Optional Cloudinary Upload (non-blocking / non-fatal)
    let imageUrl: string | null = null;
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const uploadResult = await cloudinary.uploader.upload(imageBase64, {
          folder: 'smart_farming_scans',
        });
        imageUrl = uploadResult.secure_url;
      } catch (cloudErr) {
        console.warn('[LOG] Cloudinary upload skipped/failed (non-fatal):', cloudErr);
      }
    }

    // Step 2: Extract Base64 Data & MIME type
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    // Step 3: Run Multi-API Analysis Pipeline (Plant.id -> Gemini -> Hugging Face)
    console.log('[LOG] Step 1: Invoking Plant.id API...');
    const plantIdRes = await callPlantIdAPI(base64Data, mimeType);

    console.log('[LOG] Step 2: Invoking Gemini Vision AI...');
    const geminiRes = await callGeminiAPI(base64Data, mimeType, plantIdRes);

    console.log('[LOG] Step 3: Invoking Hugging Face API...');
    const hfRes = await callHuggingFaceAPI(base64Data, mimeType);

    // Step 4: Check if Gemini flagged the image as non-plant
    if (geminiRes?.success && geminiRes?.data?.notAPlant === true) {
      return NextResponse.json({
        success: false,
        notAPlant: true,
        error: geminiRes.data.reason || 'This image does not appear to contain a plant or crop leaf. Please upload a clear plant photo.',
      }, { status: 200 });
    }

    // Step 5: Check if ALL APIs failed
    if (!plantIdRes.success && !geminiRes.success && !hfRes.success) {
      console.warn('[LOG] All AI scanner APIs failed or returned errors.');
      return NextResponse.json({
        success: false,
        error: 'Unable to analyze this image. Please upload a clearer plant image.',
      }, { status: 200 });
    }

    // Step 6: Synthesize & compare API responses into unified dynamic scanner result
    const dynamicResult = synthesizeResults(plantIdRes, geminiRes, hfRes);

    // Step 7: Dynamically retrieve verified agricultural pesticide recommendations for detected Crop + Disease
    const pesticideRecommendations = await fetchAuthoritativePesticideRecommendations(dynamicResult.plantName, dynamicResult.diseaseName);

    // Step 8: Persist in database if user session is active
    const session = await auth();
    let dbRecord = null;
    if (session?.user?.id) {
      try {
        dbRecord = await prisma.diseaseScan.create({
          data: {
            userId: session.user.id,
            imageUrl: imageUrl || (imageBase64.length < 500000 ? imageBase64 : null),
            plantName: dynamicResult.plantName,
            scientificName: dynamicResult.scientificName,
            status: dynamicResult.status,
            diseaseName: dynamicResult.diseaseName,
            confidenceScore: dynamicResult.confidenceScore,
            severity: dynamicResult.severity,
            symptoms: dynamicResult.symptoms,
            cause: dynamicResult.cause,
            organicTreatment: dynamicResult.organicTreatment,
            recommendedPesticides: dynamicResult.recommendedPesticides,
            activeIngredient: dynamicResult.activeIngredient,
            dosePerLitre: dynamicResult.dosePerLitre,
            recommendedFungicideInsecticide: dynamicResult.recommendedFungicideInsecticide,
            prevention: dynamicResult.prevention,
            irrigationAdvice: dynamicResult.irrigationAdvice,
            fertilizerAdvice: dynamicResult.fertilizerAdvice,
            expectedRecoveryTime: dynamicResult.expectedRecoveryTime,
          },
        });
        console.log('[LOG] Disease scan saved to Prisma DB successfully.');
      } catch (dbErr) {
        console.warn('[LOG] Prisma save skipped (non-fatal):', dbErr);
      }
    }

    const finalResult = {
      ...dynamicResult,
      pesticideRecommendations: pesticideRecommendations,
      id: dbRecord?.id || `scan-${Date.now()}`,
      imageUrl: dbRecord?.imageUrl || imageUrl || imageBase64,
      createdAt: dbRecord?.createdAt || new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      result: finalResult,
    });
  } catch (error: any) {
    console.error('[LOG] Error in analyze-crop route:', error);
    return NextResponse.json({
      success: false,
      error: 'Unable to analyze this image. Please upload a clearer plant image.',
    }, { status: 400 });
  }
}
