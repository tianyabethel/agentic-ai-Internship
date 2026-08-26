import {
  validateQuery,
  validateRecommendationInput,
  validateRagResult,
  validateSearchResults
} from "./guardrails.mjs";
import "dotenv/config";
import OpenAI from "openai";

import { searchActiveListings } from "./search-active-listings.mjs";
import { handleMarketQuestion } from "./market-statistics-agent.mjs";
import { getRecommendations } from "./recommendation-engine.mjs";
import { ragAnswer } from "./rag-assistant.mjs";
import { emailDraftAgent } from "./email-draft-agent.mjs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,


});

// Classify the user's intent
export async function classifyIntent(message) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You are an intent classifier for a real estate AI system.

Classify the user's request into one or more of these intents:

search
market
recommend
knowledge
email

Definitions:

search:
The user wants to find active properties or listings.

market:
The user wants market statistics, trends, prices, sales activity,
days on market, or comparable market information.

recommend:
The user wants properties similar to a specific listing or property.

knowledge:
The user is asking a real estate definition, MLS field question,
or general real estate knowledge question.

email:
The user wants a property or market summary written as an email.

A request may contain multiple intents.

Examples:

"Find homes in Pasadena"
["search"]

"Are prices rising in Pasadena?"
["market"]

"What does DOM mean?"
["knowledge"]

"Recommend properties similar to listing 12345"
["recommend"]

"Draft an email about this market summary"
["email"]

"Find affordable homes in Pasadena and tell me whether prices are rising"
["search", "market"]

Return ONLY a valid JSON array of intent names.
`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const content = response.choices[0].message.content.trim();

  return JSON.parse(content);
}

// Route the request to the appropriate agents
export async function orchestrate(message, options = {}) {
      // Guardrail 1: Validate the user's query
  const queryCheck = validateQuery(message);

  if (!queryCheck.ok) {
    return {
      query: message,
      intents: [],


      results: {
        guardrail: queryCheck.message,
      },
    };
  }
  const intents = await classifyIntent(message);

  const results = {};

  if (intents.includes("search")) {
  const searchResults = await searchActiveListings(
    options.filters || {}
  );

  const searchCheck = validateSearchResults(searchResults);

  results.search = searchCheck.ok
    ? searchResults
    : searchCheck.message;
}

  if (intents.includes("market")) {
    results.market = await handleMarketQuestion(message);
  }

  if (intents.includes("recommend")) {
  const recommendationCheck =
    validateRecommendationInput(options.targetId);

  if (!recommendationCheck.ok) {
    results.recommend = recommendationCheck.message;
  } else {
    results.recommend = await getRecommendations(
      options.targetId
    );
  }
}

  if (intents.includes("knowledge")) {
  const ragResult = await ragAnswer(message);
  const ragCheck = validateRagResult(ragResult);

  results.knowledge = ragCheck.ok
    ? ragResult
    : ragCheck.message;
}

  return {
    query: message,
    intents,
    results,
  };
}