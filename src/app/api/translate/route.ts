import { NextResponse } from 'next/server';

const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-2.5-pro',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
];

export async function POST(request: Request) {
  try {
    const { textData, targetLanguage } = await request.json();
    
    if (!textData || !targetLanguage) {
      return NextResponse.json({ error: 'Missing data or target language' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
    }

    // Extract only user-facing text fields to keep translation payload small, fast, and light
    const sanitizedDataToTranslate: Record<string, any> = {};

    const textFields = [
      'plantName',
      'diseaseName',
      'status',
      'severity',
      'symptoms',
      'cause',
      'organicTreatment',
      'recommendedPesticides',
      'activeIngredient',
      'dosePerLitre',
      'recommendedFungicideInsecticide',
      'prevention',
      'irrigationAdvice',
      'fertilizerAdvice',
      'expectedRecoveryTime'
    ];

    for (const field of textFields) {
      if (textData[field] !== undefined) {
        sanitizedDataToTranslate[field] = textData[field];
      }
    }

    const prompt = `You are a world-class agricultural translator specializing in Indian languages.
Translate all text values of the following JSON object into ${targetLanguage} accurately for farmers.
Do NOT translate key names (keep English key names).
Do NOT translate botanical scientific names in Latin script (e.g. keep "Solanum lycopersicum" in Latin script if present).

Return ONLY valid JSON.

JSON object to translate:
${JSON.stringify(sanitizedDataToTranslate, null, 2)}`;

    let resultText = '';
    let successModel = '';

    for (const modelName of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (!response.ok) {
          const errBody = await response.text();
          console.warn(`[LOG] Translation model ${modelName} returned HTTP ${response.status}:`, errBody.substring(0, 150));
          continue;
        }

        const data = await response.json();
        resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        
        if (resultText) {
          successModel = modelName;
          console.log(`[LOG] Translation succeeded with model ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[LOG] Translation model ${modelName} fetch error:`, err?.message || err);
      }
    }

    if (!resultText) {
      return NextResponse.json({ error: 'Translation service currently unavailable.' }, { status: 503 });
    }

    const cleanJsonStr = resultText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const translatedFields = JSON.parse(cleanJsonStr);

    // Merge translated text back with original metadata (preserving id, imageUrl, plant, diagnosis, analysis, sources)
    const finalTranslatedResult = {
      ...textData,
      ...translatedFields,
      plant: textData.plant ? {
        ...textData.plant,
        name: translatedFields.plantName || textData.plant.name,
      } : textData.plant,
      diagnosis: textData.diagnosis ? {
        ...textData.diagnosis,
        name: translatedFields.diseaseName || textData.diagnosis.name,
      } : textData.diagnosis,
    };

    return NextResponse.json({ success: true, result: finalTranslatedResult, model: successModel });
  } catch (error: unknown) {
    console.error('[LOG] Translation route error:', error);
    return NextResponse.json(
      { error: 'Failed to translate' },
      { status: 500 }
    );
  }
}
