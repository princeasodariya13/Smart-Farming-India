import { NextResponse } from 'next/server';

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

    const prompt = `You are a professional agricultural translator. 
Translate the following JSON object's values into ${targetLanguage} while keeping the exact same JSON keys in English. Do not translate the keys, only the values. Ensure the agricultural terminology is accurate in ${targetLanguage}.

Return ONLY valid JSON. No markdown, no extra text.

JSON to translate:
${JSON.stringify(textData, null, 2)}`;

    const GEMINI_MODELS = [
      'gemini-flash-latest',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.5-flash',
    ];

    let resultText = '';
    
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
            }
          }),
        });

        if (!response.ok) {
          const errBody = await response.text();
          console.warn(`[LOG] Translation model ${modelName} failed (${response.status}):`, errBody.substring(0, 200));
          continue; // Try next model
        }

        const data = await response.json();
        resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (resultText) {
          break; // Success
        }
      } catch (err) {
        console.warn(`[LOG] Translation network error with ${modelName}:`, err);
      }
    }

    if (!resultText) {
      throw new Error('All Gemini translation models failed or returned empty.');
    }

    // Clean markdown formatting if any
    const cleanJsonStr = resultText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const translatedJson = JSON.parse(cleanJsonStr);
    
    return NextResponse.json({ success: true, result: translatedJson });

  } catch (error: unknown) {
    console.error('[LOG] Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate' },
      { status: 500 }
    );
  }
}
