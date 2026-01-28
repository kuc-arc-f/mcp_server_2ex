//import { generateText, tool } from "ai";
import { z } from "zod";
import 'dotenv/config';
import { createInterface } from "node:readline/promises";

import { Chat } from "./tools/searchRag";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  while (true) {
    const input = await rl.question("input:");
    if (input === "exit") {
      break;
    }
    console.log("input=", input);
    const result = await Chat(input, "sess1")
    break;
    rl.write("\n");
  }
}
main().catch((err) => {
    console.error("Error:", err);
})
.finally(() => {
  rl.close();
});