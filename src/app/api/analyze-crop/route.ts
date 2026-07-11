import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Step 4: Cloudinary Upload
    let imageUrl = null;
    try {
      const uploadResult = await cloudinary.uploader.upload(imageBase64, {
        folder: 'smart_farming_scans'
      });
      imageUrl = uploadResult.secure_url;
      console.log("[LOG] Cloudinary Upload Success. URL:", imageUrl);
    } catch (cloudErr) {
      console.error("[LOG] Cloudinary upload failed:", cloudErr);
    }

    // Strip prefix for APIs if needed
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    // Step 1: PlantNet -> Identify the plant
    const plantNetApiKey = process.env.PLANT_ID_API_KEY;
    
    if (!plantNetApiKey) {
      return NextResponse.json({ error: 'PlantNet API key not configured' }, { status: 500 });
    }
    
    let plantName = "";
    let confidence = 0;
    
    console.log("[LOG] Sending request to PlantNet...");

    try {
      const plantNetUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${plantNetApiKey}&images=${encodeURIComponent(imageUrl || '')}`;
      const plantResponse = await fetch(plantNetUrl, { method: "GET" });

      if (plantResponse.ok) {
        const plantData = await plantResponse.json();
        console.log("[LOG] PlantNet Response Received:", JSON.stringify(plantData).substring(0, 500) + "...");
        
        if (plantData.results && plantData.results.length > 0) {
          const bestMatch = plantData.results[0];
          confidence = (bestMatch.score || 0) * 100;
          
          if (bestMatch.species?.commonNames?.length > 0) {
            plantName = bestMatch.species.commonNames[0];
          } else if (bestMatch.species?.scientificNameWithoutAuthor) {
            plantName = bestMatch.species.scientificNameWithoutAuthor;
          }
        }
      } else {
        const errText = await plantResponse.text();
        console.error("[LOG] PlantNet API failed with status:", plantResponse.status, errText);
      }
    } catch (err) {
      console.error("[LOG] PlantNet API error:", err);
    }

    // Step 2: Hugging Face -> Detect Disease
    let diseaseName = "Analysis Failed";
    let isHealthy = false;
    let diseaseConfidence = 0;
    
    console.log("[LOG] Sending request to Hugging Face...");
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (hfApiKey) {
      try {
        // Using a popular plant disease classification model
        const hfModelUrl = "https://api-inference.huggingface.co/models/dima806/plant_diseases_classification";
        
        // Convert base64 data back to raw buffer for Hugging Face
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Helper for auto-retry on 503 (Model Loading)
        let hfResponse;
        let retries = 0;
        const maxRetries = 5;
        
        while (retries < maxRetries) {
          hfResponse = await fetch(hfModelUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${hfApiKey}`,
              "Content-Type": "application/octet-stream"
            },
            body: buffer
          });

          if (hfResponse.status === 503) {
            const errData = await hfResponse.json();
            const waitTime = errData.estimated_time || 5;
            console.log(`[LOG] Hugging Face model loading. Waiting ${waitTime} seconds... (Attempt ${retries + 1}/${maxRetries})`);
            await new Promise(res => setTimeout(res, waitTime * 1000));
            retries++;
          } else {
            break; // Success or non-retriable error
          }
        }

        if (hfResponse && hfResponse.ok) {
          const hfData = await hfResponse.json();
          console.log("[LOG] Hugging Face Response Received:", JSON.stringify(hfData));
          
          if (Array.isArray(hfData) && hfData.length > 0) {
            const topPrediction = hfData[0];
            // Format: "Tomato___Early_blight" -> "Tomato - Early blight"
            diseaseName = topPrediction.label.replace(/___/g, ' - ').replace(/_/g, ' ');
            
            // Capitalize properly
            diseaseName = diseaseName.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            diseaseConfidence = topPrediction.score * 100;
            isHealthy = diseaseName.toLowerCase().includes('healthy');
          }
        } else if (hfResponse) {
          const errText = await hfResponse.text();
          console.error("[LOG] Hugging Face API failed with status:", hfResponse.status, errText);
          return NextResponse.json({ error: 'Hugging Face API Error: ' + hfResponse.status }, { status: 500 });
        }
      } catch (err) {
        console.error("[LOG] Hugging Face API error:", err);
        return NextResponse.json({ error: 'Failed to connect to AI model' }, { status: 500 });
      }
    } else {
      console.warn("[LOG] No HUGGINGFACE_API_KEY found, failing.");
      return NextResponse.json({ error: 'Hugging Face API key not configured' }, { status: 500 });
    }

    // Step 3: Backend Mapping -> Map disease to treatments
    console.log("[LOG] Mapping disease to treatments...");
    
    // Import dynamically so it doesn't break if file isn't compiled
    const { getDiseaseMapping } = await import('@/lib/disease-mapping');
    const mapping = getDiseaseMapping(diseaseName);

    const result = {
      plantName: plantName || "Unknown Plant",
      scientificName: plantName,
      status: isHealthy ? "Healthy" : "Diseased",
      diseaseName: diseaseName,
      confidenceScore: diseaseConfidence > 0 ? Number(diseaseConfidence.toFixed(1)) : Number(confidence.toFixed(1)),
      severity: mapping.severity,
      symptoms: mapping.symptoms,
      cause: mapping.cause,
      organicTreatment: mapping.organicTreatment,
      recommendedPesticides: mapping.recommendedPesticides,
      activeIngredient: mapping.activeIngredient,
      dosePerLitre: mapping.dosePerLitre,
      recommendedFungicideInsecticide: mapping.recommendedFungicideInsecticide,
      prevention: mapping.prevention,
      irrigationAdvice: mapping.irrigationAdvice,
      fertilizerAdvice: mapping.fertilizerAdvice,
      expectedRecoveryTime: mapping.expectedRecoveryTime,
    };
    
    console.log("[LOG] Final Parsed Result:", result);

    // Step 4: MongoDB -> Store scan history
    const session = await auth();
    if (session?.user?.id) {
      try {
        await prisma.diseaseScan.create({
          data: {
            userId: session.user.id,
            imageUrl: imageUrl, 
            ...result
          }
        });
        console.log("[LOG] Successfully saved to MongoDB DiseaseScan history.");
      } catch (dbErr) {
        console.error("[LOG] Database save error:", dbErr);
      }
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('[LOG] Error analyzing crop (Critical):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
