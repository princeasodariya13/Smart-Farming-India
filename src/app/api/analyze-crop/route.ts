import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Step 1: Upload to Cloudinary for storage
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

    // Step 2: Use Gemini Vision for full plant + disease analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // Strip data URL prefix for Gemini
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    const mimeMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,/);
    const mimeType = (mimeMatch?.[1] ?? 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/webp';

    const prompt = `You are an expert agricultural botanist and plant pathologist with deep knowledge of Indian crops and farming.

Analyze this plant/crop image carefully and provide a complete, accurate disease diagnosis report.

Return ONLY a valid JSON object with no markdown, no code blocks, no extra text — just raw JSON.

The JSON must have exactly these fields:
{
  "plantName": "Common name of the plant (e.g. Tomato, Wheat, Cotton, Rice)",
  "scientificName": "Scientific/botanical name",
  "status": "Healthy OR Diseased OR Pest Infestation",
  "diseaseName": "Exact disease or condition name (e.g. Early Blight, Powdery Mildew, Leaf Spot). Write 'Healthy' if no disease.",
  "confidenceScore": 92.5,
  "severity": "None OR Mild OR Moderate OR High OR Critical",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "cause": "Scientific cause: pathogen name, type (fungal/bacterial/viral/pest), transmission",
  "organicTreatment": "Organic/natural treatment methods suitable for Indian farmers",
  "recommendedPesticides": ["Pesticide 1", "Pesticide 2"],
  "activeIngredient": "Active chemical ingredient and concentration (e.g. Mancozeb 75% WP)",
  "dosePerLitre": "Dosage per litre of water (e.g. 2 grams per litre)",
  "recommendedFungicideInsecticide": "Primary recommended product name available in India",
  "prevention": ["prevention tip 1", "prevention tip 2", "prevention tip 3"],
  "irrigationAdvice": "Specific irrigation advice for this disease/plant",
  "fertilizerAdvice": "Fertilizer recommendation considering the disease condition",
  "expectedRecoveryTime": "Expected recovery time with proper treatment"
}

Important rules:
- Be specific and accurate. Use real pesticide names available in Indian markets.
- If the image is not a plant, set plantName to "Not a Plant" and status to "Invalid".
- If the plant appears healthy, set diseaseName to "Healthy" and severity to "None".
- Base confidenceScore on actual visual evidence in the image (0-100).`;

    console.log('[LOG] Sending image to Gemini Vision...');

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ]);

    const rawText = result.response.text().trim();
    console.log('[LOG] Gemini Raw Response:', rawText.substring(0, 500));

    // Parse JSON — strip any accidental markdown fences
    let analysisData;
    try {
      const jsonStr = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      analysisData = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('[LOG] JSON Parse Error:', parseErr, '\nRaw:', rawText);
      return NextResponse.json(
        { error: 'AI returned an unexpected format. Please try again.' },
        { status: 500 }
      );
    }

    const analysisResult = {
      plantName: analysisData.plantName || 'Unknown Plant',
      scientificName: analysisData.scientificName || '',
      status: analysisData.status || 'Unknown',
      diseaseName: analysisData.diseaseName || 'Unknown',
      confidenceScore: typeof analysisData.confidenceScore === 'number' ? analysisData.confidenceScore : 0,
      severity: analysisData.severity || 'Unknown',
      symptoms: Array.isArray(analysisData.symptoms) ? analysisData.symptoms : [],
      cause: analysisData.cause || '',
      organicTreatment: analysisData.organicTreatment || '',
      recommendedPesticides: Array.isArray(analysisData.recommendedPesticides)
        ? analysisData.recommendedPesticides
        : [],
      activeIngredient: analysisData.activeIngredient || '',
      dosePerLitre: analysisData.dosePerLitre || '',
      recommendedFungicideInsecticide: analysisData.recommendedFungicideInsecticide || '',
      prevention: Array.isArray(analysisData.prevention) ? analysisData.prevention : [],
      irrigationAdvice: analysisData.irrigationAdvice || '',
      fertilizerAdvice: analysisData.fertilizerAdvice || '',
      expectedRecoveryTime: analysisData.expectedRecoveryTime || '',
    };

    // Step 3: Save to MongoDB
    const session = await auth();
    if (session?.user?.id) {
      try {
        await prisma.diseaseScan.create({
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

    return NextResponse.json({ success: true, result: analysisResult });
  } catch (error: any) {
    console.error('[LOG] Critical error in analyze-crop:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
