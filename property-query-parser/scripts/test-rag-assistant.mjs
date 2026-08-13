import { ragAnswer } from "./rag-assistant.mjs";

const questions = [
  "What does DOM mean?",
  "What columns are in california_sold?",
  "What is a list-to-close ratio?",
];

for (const question of questions) {
  console.log("\n==============================");
  console.log("Question:", question);

  try {
    const result = await ragAnswer(question);

    console.log("\nAnswer:");
    console.log(result.answer);

    console.log("\nSources:");
    console.log(result.sources);
  } catch (error) {
    console.error("RAG test failed:", error);
  }
}
