const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const genAI = new GoogleGenerativeAI('AIzaSyDGwayrt5Cg_3qylxdeQfTAQT_ZRxRXxNc');

// Read a real image from the project public folder
const imgPath = path.join(__dirname, 'public', 'images', 'wheat.png');
const imgBuffer = fs.readFileSync(imgPath);
const imgBase64 = imgBuffer.toString('base64');

async function test() {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  
  const prompt = `You are a plant pathologist. Analyze this plant image and return ONLY raw JSON (no markdown):
{
  "plantName": "plant common name",
  "scientificName": "botanical name",
  "status": "Healthy or Diseased",
  "diseaseName": "disease name or Healthy",
  "confidenceScore": 90,
  "severity": "None or Mild or Moderate or High or Critical",
  "symptoms": ["symptom 1"],
  "cause": "cause of disease",
  "organicTreatment": "organic treatment",
  "recommendedPesticides": ["Pesticide 1"],
  "activeIngredient": "active ingredient",
  "dosePerLitre": "dose per litre",
  "recommendedFungicideInsecticide": "product name",
  "prevention": ["tip 1"],
  "irrigationAdvice": "advice",
  "fertilizerAdvice": "advice",
  "expectedRecoveryTime": "time"
}`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType: 'image/png', data: imgBase64 } }
  ]);
  
  const text = result.response.text();
  console.log('Response:', text.substring(0, 500));
}

test().catch(e => console.log('Error:', e.message.substring(0, 500)));
