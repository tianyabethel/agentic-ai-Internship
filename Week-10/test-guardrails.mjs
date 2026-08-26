import {
  validateQuery,
  validateRecommendationInput,
  validateRagResult,
  validateSearchResults
} from "./guardrails.mjs";

console.log("\n=== WEEK 10 GUARDRAIL TESTS ===\n");

// Test 1: Empty query
console.log("Test 1 - Empty Query:");
console.log(validateQuery(""));

// Test 2: Valid query
console.log("\nTest 2 - Valid Query:");
console.log(validateQuery("Find homes in Pasadena"));

// Test 3: Missing recommendation ID
console.log("\nTest 3 - Missing Listing ID:");
console.log(validateRecommendationInput(null));

// Test 4: Valid recommendation ID
console.log("\nTest 4 - Valid Listing ID:");
console.log(validateRecommendationInput("1165839960"));

// Test 5: Empty search results
console.log("\nTest 5 - Empty Search Results:");
console.log(validateSearchResults([]));

// Test 6: Good RAG result
console.log("\nTest 6 - Good RAG Result:");
console.log(
  validateRagResult({
    sources: [
      {
        source: "real-estate-glossary.md",
        similarity: 0.44
      }
    ]
  })
);

// Test 7: Low-confidence RAG result
console.log("\nTest 7 - Low Confidence RAG:");
console.log(
  validateRagResult({
    sources: [
      {
        source: "real-estate-glossary.md",
        similarity: 0.10
      }
    ]
  })
);

console.log("\n=== GUARDRAIL TESTS COMPLETE ===");
