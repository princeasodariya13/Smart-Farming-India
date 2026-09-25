import { NextResponse } from 'next/server';

const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-2.5-pro',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
];

/**
 * Free Google Translation API helper (Fast, reliable, zero key required)
 */
async function translateValueFast(value: any, targetLang: string = 'gu'): Promise<any> {
  if (!value) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0 || trimmed.startsWith('http') || trimmed.startsWith('data:')) {
      return value;
    }
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) return value;
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        return data[0].map((item: any) => item[0]).join('');
      }
    } catch {
      return value;
    }
  } else if (Array.isArray(value)) {
    return Promise.all(value.map(item => translateValueFast(item, targetLang)));
  }
  return value;
}

/**
 * Bulletproof translation engine using Parallel Translate + Gemini AI fallback
 */
async function translatePayload(sanitizedData: Record<string, any>, targetLanguage: string) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // Try Engine 1: Gemini AI models if key is available
  if (apiKey && !apiKey.startsWith('AQ.')) {
    const prompt = `You are a world-class agricultural translator specializing in Indian languages.
Translate all text values of the following JSON object into ${targetLanguage} accurately for farmers.
Do NOT translate key names (keep English key names).
Do NOT translate botanical scientific names in Latin script (e.g. keep "Solanum lycopersicum" in Latin script if present).

Return ONLY valid JSON.

JSON object to translate:
${JSON.stringify(sanitizedData, null, 2)}`;

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
          signal: AbortSignal.timeout(4000),
        });

        if (response.ok) {
          const data = await response.json();
          const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (resultText) {
            const cleanJsonStr = resultText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
            const parsed = JSON.parse(cleanJsonStr);
            console.log(`[LOG] Translation succeeded via Gemini AI (${modelName})`);
            return parsed;
          }
        }
      } catch (err) {
        continue;
      }
    }
  }

  // Engine 2: Bulletproof Fast Parallel Translator (Fallback Engine)
  console.log('[LOG] Performing fast parallel translation engine fallback...');
  const langCode = targetLanguage.toLowerCase().startsWith('guj') ? 'gu' : (targetLanguage.toLowerCase().startsWith('hin') ? 'hi' : 'gu');

  const entries = Object.entries(sanitizedData);
  const translatedEntries = await Promise.all(
    entries.map(async ([key, val]) => {
      if (key === 'scientificName') return [key, val]; // Keep Latin scientific name
      const translatedVal = await translateValueFast(val, langCode);
      return [key, translatedVal];
    })
  );

  return Object.fromEntries(translatedEntries);
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

    const { textData, targetLanguage } = bodyData;
    
    if (!textData || !targetLanguage) {
      return NextResponse.json({ error: 'Missing textData or targetLanguage' }, { status: 400 });
    }

    // Extract user-facing text fields to translate
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

    // Translate sanitized payload
    const translatedFields = await translatePayload(sanitizedDataToTranslate, targetLanguage);

    // Merge translated text back with original metadata
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

    return NextResponse.json({
      success: true,
      result: finalTranslatedResult,
    });
  } catch (error: any) {
    console.error('[LOG] Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate' },
      { status: 500 }
    );
  }
}
