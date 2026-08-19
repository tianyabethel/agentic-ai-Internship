import { emailDraftAgent } from "./email-draft-agent.mjs";

const testData = `
Pasadena market summary:
Median close price: $875,000
Average days on market: 24
Closed sales: 118
`;

const result = await emailDraftAgent(testData);

console.log("\nEMAIL DRAFT:\n");
console.log(result);