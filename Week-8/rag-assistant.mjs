import "dotenv/config";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DOCS_DIR = path.resolve("skills/property-query-parser/docs");

function chunkText(text, chunkSize = 700) {
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}

async function getEmbedding(text) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function loadKnowledgeBase() {
  const files = fs.readdirSync(DOCS_DIR).filter((file) => file.endsWith(".md"));

  const knowledgeBase = [];

  for (const file of files) {
    const fullPath = path.join(DOCS_DIR, file);
    const text = fs.readFileSync(fullPath, "utf8");

    const chunks = chunkText(text);

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);

      knowledgeBase.push({
        source: file,
        text: chunk,
        embedding,
      });
    }
  }

  return knowledgeBase;
}

async function retrieve(question, knowledgeBase, topK = 3) {
  const questionEmbedding = await getEmbedding(question);

  const scoredChunks = knowledgeBase.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(questionEmbedding, chunk.embedding),
  }));

  scoredChunks.sort((a, b) => b.score - a.score);

  return scoredChunks.slice(0, topK);
}

export async function ragAnswer(question) {
  const knowledgeBase = await loadKnowledgeBase();

  const results = await retrieve(question, knowledgeBase);

  const context = results.map((result) => `Source: ${result.source}\n${result.text}`).join("\n\n");

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a real estate data assistant. Answer the user's question using only the provided context. If the answer is not in the context, say you do not have enough information.",
      },
      {
        role: "user",
        content: `
Context:

${context}

Question:
${question}
        `,
      },
    ],
  });

  return {
    answer: response.choices[0].message.content,
    sources: results.map((result) => ({
      source: result.source,
      similarity: Number(result.score.toFixed(3)),
    })),
  };
}
