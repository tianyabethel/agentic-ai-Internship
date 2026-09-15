import "dotenv/config";
import OpenAI from "openai";
import nodemailer from "nodemailer";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// STEP 1: Draft only. Never send without approval.
export async function draftEmail(input) {
  const prompt = `
You are a real estate email drafting assistant.

Create a concise, professional email based only on the information below.

Do not invent property details, prices, statistics, or market information. Preserve every provided number, dollar amount, percentage, and date exactly as given.

Information:
${input}

Return:
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

  return {
    draft: response.choices[0].message.content,
    status: "pending_approval",
  };
}

// STEP 2: Send only after explicit human approval.
export async function sendApprovedEmail({ to, subject, body, approved }) {
  if (approved !== true) {
    throw new Error("Email requires explicit human approval before sending.");
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email credentials are not configured.");
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: body,
  });

  return {
    status: "sent",
    to,
  };
}

export async function emailDraftAgent(input) {
  return draftEmail(input);
}
