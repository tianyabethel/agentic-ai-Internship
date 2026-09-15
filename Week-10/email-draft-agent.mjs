import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function emailDraftAgent(input) {
  const prompt = `
You are a real estate email drafting assistant.

Create a concise, professional email based on the information below.

Use only the information provided.
Do not invent property details, prices, statistics, or market information.

Information:
${input}

Return the email with:
Subject:
Body:
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}