import { orchestrate } from "./orchestrator.mjs";

const tests = [
  {
    name: "Knowledge Test",
    query: "What does DOM mean?",
  },
  {
    name: "Market Test",
    query: "Are home prices rising in Pasadena?",
  },
  {
    name: "Mixed Intent Test",
    query:
      "Find affordable homes in Pasadena and tell me whether prices are rising.",
    options: {
      filters: {
        city: "Pasadena",
      },
    },
  },
  {
    name: "Email Test",
    query:
      "Draft an email summarizing the Pasadena real estate market.",
    options: {
      emailContent:
        "Pasadena market update: median close price is $875,000 and average days on market is 24.",
    },
  },
];

for (const test of tests) {
  console.log("\n================================");
  console.log(test.name);
  console.log("Query:", test.query);

  try {
    const result = await orchestrate(
      test.query,
      test.options || {}
    );

    console.log("\nDetected intents:");
    console.log(result.intents);

    console.log("\nResults:");
    console.dir(result.results, {
      depth: 4,
      maxArrayLength: 5,
    });
  } catch (error) {
    console.error("\nTest failed:");
    console.error(error);
  }
}