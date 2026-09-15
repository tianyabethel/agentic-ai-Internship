import { orchestrate } from "./orchestrator.mjs";

const message = process.argv.slice(2).join(" ");

if (!message) {
  console.error("Usage: node whatsapp-handler.mjs \"your message\"");
  process.exit(1);
}

const result = await orchestrate(message);

console.log(JSON.stringify(result, null, 2));
