import { evaluationDataset } from "./evaluation-dataset.mjs";
import { classifyIntent } from "./orchestrator.mjs";

let passed = 0;
let failed = 0;

console.log("\n=== WEEK 10 AGENT EVALUATION ===\n");

for (const test of evaluationDataset) {
  try {
    const actualIntents = await classifyIntent(test.query);

    const expected = [...test.expectedIntents].sort();
    const actual = [...actualIntents].sort();

    const success =
      JSON.stringify(expected) === JSON.stringify(actual);

    console.log(`Test ${test.id}: ${test.query}`);
    console.log(`Expected: ${expected.join(", ")}`);
    console.log(`Actual:   ${actual.join(", ")}`);
    console.log(success ? "PASS ✓" : "FAIL ✗");
    console.log("--------------------------------");

    if (success) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.log(`Test ${test.id}: ERROR`);
    console.log(error.message);
    console.log("--------------------------------");
    failed++;
  }
}

const total = passed + failed;
const accuracy = ((passed / total) * 100).toFixed(1);

console.log("\n=== RESULTS ===");
console.log(`Passed: ${passed}/${total}`);
console.log(`Failed: ${failed}/${total}`);
console.log(`Intent Accuracy: ${accuracy}%`);