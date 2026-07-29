import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Models to try, in order of preference
const GEMINI_MODELS = [
  'gemini-flash-latest',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
];

const CROP_ANALYSIS_PROMPT = `You are a world-class agricultural botanist and plant pathologist specializing in Indian crops.

CRITICAL INSTRUCTION: First, carefully examine the image.
- If the image does NOT contain a plant, leaf, crop, or agricultural subject (e.g., it is a cartoon, person, animal, building, food, random object), you MUST respond with ONLY this JSON:
  {"notAPlant": true, "reason": "This image does not appear to contain a plant or crop. Please upload a clear photo of a plant leaf or crop."}

- If the image DOES contain a plant or crop, provide a thorough diagnosis and return ONLY this JSON (no markdown, no code blocks, no extra text):
{
  "notAPlant": false,
  "plantName": "exact common name",
  "scientificName": "scientific binomial name",
  "status": "Healthy OR Diseased",
  "diseaseName": "exact disease name, or 'Healthy Plant' if no disease",
  "confidenceScore": 90,
  "severity": "None OR Low OR Medium OR High",
  "symptoms": ["observed symptom 1", "observed symptom 2", "observed symptom 3"],
  "cause": "detailed scientific explanation",
  "organicTreatment": "step-by-step organic treatment plan",
  "recommendedPesticides": ["pesticide 1", "pesticide 2"],
  "activeIngredient": "active chemical ingredient name",
  "dosePerLitre": "precise dosage per litre of water",
  "recommendedFungicideInsecticide": "brand name available in Indian market",
  "prevention": ["prevention tip 1", "prevention tip 2", "prevention tip 3"],
  "irrigationAdvice": "expert advice on watering",
  "fertilizerAdvice": "expert fertilizer recommendation",
  "expectedRecoveryTime": "estimated time after treatment"
}`;

async function callGeminiREST(apiKey: string, modelName: string, base64Data: string, mimeType: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const body = {
    contents: [{
      parts: [
        { text: CROP_ANALYSIS_PROMPT },
        { inline_data: { mime_type: mimeType, data: base64Data } }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 8192,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errText.substring(0, 200)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text.trim();
}

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
    }

    // Step 1: Upload to Cloudinary
    let imageUrl: string | null = null;
    try {
      const uploadResult = await cloudinary.uploader.upload(imageBase64, {
        folder: 'smart_farming_scans',
      });
      imageUrl = uploadResult.secure_url;
      console.log('[LOG] Cloudinary Upload Success:', imageUrl);
    } catch (cloudErr) {
      console.error('[LOG] Cloudinary upload failed (non-fatal):', cloudErr);
    }

    // Step 2: Prepare image data
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    // Step 3: Try each model via direct REST API
    let rawResponseText = '';
    let modelUsed = '';
    let isRateLimited = false;

    for (const modelName of GEMINI_MODELS) {
      try {
        console.log(`[LOG] Trying model: ${modelName}...`);
        rawResponseText = await callGeminiREST(apiKey, modelName, base64Data, mimeType);
        modelUsed = modelName;
        console.log(`[LOG] Success with model: ${modelName}`);
        break;
      } catch (modelError: any) {
        const errMsg = modelError?.message || '';
        console.warn(`[LOG] Model ${modelName} failed: ${errMsg.substring(0, 120)}`);

        // If it's an auth error, no point trying other models
        if (errMsg.includes('403') || errMsg.includes('API_KEY_INVALID') || errMsg.includes('reported as leaked')) {
          console.error('[CRITICAL] API key is invalid or banned. Stopping.');
          return NextResponse.json({
            error: 'Gemini API key is invalid or banned. Please get a new key at https://aistudio.google.com/apikey',
            needsNewKey: true,
          }, { status: 503 });
        }
        
        // Check if it's a 429 Rate Limit
        if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          isRateLimited = true;
        }
        continue;
      }
    }

    if (!rawResponseText) {
      if (isRateLimited) {
        return NextResponse.json({
          error: '⏳ Google AI free tier limit reached. Please wait 1 minute and try again.',
        }, { status: 429 });
      }
      
      return NextResponse.json({
        error: 'All Gemini models failed. Check your API key and ensure it has Generative Language API enabled.',
        needsNewKey: true,
      }, { status: 503 });
    }

    // Step 4: Parse response
    const jsonStr = rawResponseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch {
      console.error('[LOG] JSON parse failed. Raw text:', jsonStr.substring(0, 300));
      return NextResponse.json({ error: 'AI returned malformed JSON. Please try again.' }, { status: 500 });
    }

    // Step 5: Reject non-plant images
    if (parsedData.notAPlant === true) {
      console.log('[LOG] Non-plant image detected. Rejecting.');
      return NextResponse.json({
        success: false,
        notAPlant: true,
        error: parsedData.reason || 'This image does not appear to contain a crop or plant.',
      }, { status: 422 });
    }

    console.log(`[LOG] Gemini (${modelUsed}) diagnosed: ${parsedData.plantName} — ${parsedData.diseaseName}`);

    const analysisResult = {
      plantName: parsedData.plantName || 'Unknown Plant',
      scientificName: parsedData.scientificName || '',
      status: parsedData.status || 'Unknown',
      diseaseName: parsedData.diseaseName || 'Unknown',
      confidenceScore: typeof parsedData.confidenceScore === 'number' ? parsedData.confidenceScore : 85,
      severity: parsedData.severity || 'None',
      symptoms: Array.isArray(parsedData.symptoms) ? parsedData.symptoms : [],
      cause: parsedData.cause || '',
      organicTreatment: parsedData.organicTreatment || '',
      recommendedPesticides: Array.isArray(parsedData.recommendedPesticides) ? parsedData.recommendedPesticides : [],
      activeIngredient: parsedData.activeIngredient || '',
      dosePerLitre: parsedData.dosePerLitre || '',
      recommendedFungicideInsecticide: parsedData.recommendedFungicideInsecticide || '',
      prevention: Array.isArray(parsedData.prevention) ? parsedData.prevention : [],
      irrigationAdvice: parsedData.irrigationAdvice || '',
      fertilizerAdvice: parsedData.fertilizerAdvice || '',
      expectedRecoveryTime: parsedData.expectedRecoveryTime || '',
    };

    // Step 6: Save to MongoDB
    const session = await auth();
    let dbRecord = null;
    if (session?.user?.id) {
      try {
        dbRecord = await prisma.diseaseScan.create({
          data: {
            userId: session.user.id,
            imageUrl: imageUrl,
            ...analysisResult,
          },
        });
        console.log('[LOG] Scan saved to MongoDB successfully.');
      } catch (dbErr) {
        console.error('[LOG] Database save error (non-fatal):', dbErr);
      }
    }

    const finalResult = {
      ...analysisResult,
      id: dbRecord?.id || Date.now().toString(),
      imageUrl: dbRecord?.imageUrl || imageUrl,
      createdAt: dbRecord?.createdAt || new Date().toISOString(),
    };

    return NextResponse.json({ success: true, result: finalResult });
  } catch (error: unknown) {
    console.error('[LOG] Critical error in analyze-crop:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
