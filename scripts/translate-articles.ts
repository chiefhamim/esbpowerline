import { config } from 'dotenv';
import { existsSync } from 'fs';
import { createScriptPrismaClient } from '../prisma/client';
import type { PrismaClient } from '@prisma/client';

// Load environment variables
config({ path: '.env' });
if (existsSync('.env.local')) {
  config({ path: '.env.local', override: true });
}
if (existsSync('.env.production.local')) {
  config({ path: '.env.production.local', override: true });
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables. Please add it to .env.local');
  process.exit(1);
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

type TranslationOutput = {
  title: string;
  excerpt: string;
  content: string;
};

async function callGeminiTranslation(textToTranslate: string, promptInstruction: string): Promise<TranslationOutput> {
  const requestBody = {
    contents: [
      {
        parts: [
          { text: promptInstruction },
          { text: `Here is the article to translate:\n\n${textToTranslate}` }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          excerpt: { type: 'STRING' },
          content: { type: 'STRING' }
        },
        required: ['title', 'excerpt', 'content']
      }
    }
  };

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!jsonText) {
    throw new Error('Failed to retrieve translation text from Gemini response');
  }

  return JSON.parse(jsonText) as TranslationOutput;
}

const EN_TO_BN_PROMPT = `
You are a professional bilingual news editor and translator specializing in English-to-Bengali journalism.

Your task is to translate the provided English news article into clear, natural, professional Bengali while strictly preserving the original meaning, facts, context, tone, intent, and journalistic integrity.

Translation Requirements:
1. Preserve all facts, quotes, names, dates, numbers, locations, and contextual details exactly as they appear in the source.
2. Do not add, remove, speculate, exaggerate, simplify, or reinterpret information.
3. Maintain the original message, narrative structure, and editorial neutrality.
4. Translate idioms, expressions, and culturally specific phrases into their closest natural Bengali equivalents while preserving their intended meaning.
5. Write in the style of a reputable international news publication, using clear, polished, and professional journalistic Bengali.
6. Ensure the text remains human-sounding, readable, and engaging rather than robotic or overly literal.
7. Avoid sensationalism, clickbait language, editorial opinions, or unnecessary embellishment.
8. Keep paragraph structure similar to the original whenever practical.
9. Preserve direct quotations faithfully while making them grammatically natural in Bengali.
10. If a phrase is ambiguous, choose the most contextually accurate translation rather than inventing meaning.
11. Do not summarize or condense the article. Provide a complete translation.
12. Do not explain your translation choices.
13. Retain the original headline's intent and tone while adapting it into professional Bengali news style.

You must output a JSON object containing exactly the translated "title", "excerpt", and "content" (keeping HTML tag structures intact for inline tags like <a>, <strong>, <em>, <p>, <table>, etc.).
`;

const BN_TO_EN_PROMPT = `
You are a professional bilingual news editor and translator specializing in Bengali-to-English journalism.

Your task is to translate the provided Bengali news article into clear, natural, professional English while strictly preserving the original meaning, facts, context, tone, intent, and journalistic integrity.

Translation Requirements:
1. Preserve all facts, quotes, names, dates, numbers, locations, and contextual details exactly as they appear in the source.
2. Do not add, remove, speculate, exaggerate, simplify, or reinterpret information.
3. Maintain the original message, narrative structure, and editorial neutrality.
4. Translate idioms, expressions, and culturally specific phrases into their closest natural English equivalents while preserving their intended meaning.
5. Write in the style of a reputable international news publication, using clear, polished, and professional journalistic English.
6. Ensure the text remains human-sounding, readable, and engaging rather than robotic or overly literal.
7. Avoid sensationalism, clickbait language, editorial opinions, or unnecessary embellishment.
8. Keep paragraph structure similar to the original whenever practical.
9. Preserve direct quotations faithfully while making them grammatically natural in English.
10. If a phrase is ambiguous, choose the most contextually accurate translation rather than inventing meaning.
11. Do not summarize or condense the article. Provide a complete translation.
12. Do not explain your translation choices unless explicitly asked.
13. Retain the original headline's intent and tone while adapting it into professional English news style.

Before providing the final translation, internally verify that:
- No factual information has been altered.
- No important details have been omitted.
- The translation reads naturally to an English-speaking news audience.
- The journalistic tone remains faithful to the source article.

You must output a JSON object containing exactly the translated "title", "excerpt", and "content" (keeping HTML tag structures intact for inline tags like <a>, <strong>, <em>, <p>, <table>, etc.).
`;

async function main() {
  const prisma = createScriptPrismaClient();
  console.log('🤖 Starting automated news translation pipeline...\n');

  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const toProcess = articles.filter(a => !a.titleBn || !a.contentBn);
    console.log(`📊 Found ${articles.length} articles in total. ${toProcess.length} need translation.`);

    if (toProcess.length === 0) {
      console.log('✅ All articles are already translated!');
      return;
    }

    let processedCount = 0;
    for (const article of toProcess) {
      processedCount++;
      const isBengali = /[\u0980-\u09FF]/.test(article.title);
      const directionStr = isBengali ? 'BN ➔ EN' : 'EN ➔ BN';
      console.log(`[${processedCount}/${toProcess.length}] (${directionStr}) Translating: "${article.title.slice(0, 50)}..."`);

      try {
        const textPayload = `HEADLINE: ${article.title}\nEXCERPT: ${article.excerpt || ''}\nBODY: ${article.content}`;
        const targetPrompt = isBengali ? BN_TO_EN_PROMPT : EN_TO_BN_PROMPT;
        
        // Execute translation via Gemini
        const result = await callGeminiTranslation(textPayload, targetPrompt);

        if (isBengali) {
          // If Bengali, original content is saved in Bn fields, English goes to main fields
          await prisma.article.update({
            where: { id: article.id },
            data: {
              title: result.title,
              excerpt: result.excerpt,
              content: result.content,
              titleBn: article.title,
              excerptBn: article.excerpt,
              contentBn: article.content,
              locale: 'en' // English is primary
            }
          });
          console.log(`  ✓ Updated (En: "${result.title.slice(0, 40)}...", Bn: "${article.title.slice(0, 40)}...")`);
        } else {
          // If English, original remains in main, Bengali goes to Bn fields
          await prisma.article.update({
            where: { id: article.id },
            data: {
              titleBn: result.title,
              excerptBn: result.excerpt,
              contentBn: result.content
            }
          });
          console.log(`  ✓ Updated (En: "${article.title.slice(0, 40)}...", Bn: "${result.title.slice(0, 40)}...")`);
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (err: any) {
        console.error(`  ❌ Failed to translate article "${article.title}":`, err.message || err);
      }
    }

    console.log('\n🎉 Translation pipeline finished.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('❌ Critical script failure:', err);
  process.exit(1);
});
