/**
 * Run
 */
import pc from "picocolors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { loadConfig, configExists } from "../storage/configStore.js";
import { WhatsAppBot } from "../bot.js";

const envPath = path.join(process.cwd(), ".env");
const envPathAlt = path.join(process.cwd(), "env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (fs.existsSync(envPathAlt)) {
  dotenv.config({ path: envPathAlt });
}

export const runBot = async (): Promise<void> => {
  console.log();

  let openaiKey: string | undefined;
  let googleKey: string | undefined;
  let username: string = "User";
  let agentName: string = "Assistant";

  if (configExists()) {
    const config = loadConfig();
    if (config) {
      openaiKey = config.openaiApiKey;
      googleKey = config.googleApiKey;
      username = config.username;
      agentName = config.agentName;
      console.log(
        pc.green(`  ✓ Config loaded for ${pc.bold(username)} with agent ${pc.bold(agentName)}`),
      );
    } else {
      console.log(pc.yellow("  ⚠ Config found but could not be decrypted. Falling back to .env"));
    }
  } else {
    console.log(pc.yellow("  ⚠ No config found. Checking .env file..."));
  }

  if (!openaiKey) {
    openaiKey = process.env.OPENAI_API_KEY;
  }
  if (!googleKey) {
    googleKey = process.env.GOOGLE_API;
  }

  if (!openaiKey) {
    console.log(pc.red("  ✗ OpenAI API key not found!"));
    console.log(
      pc.dim("    Run 'Chat-Buddy init' to set up, or create a .env with OPENAI_API_KEY."),
    );
    process.exit(1);
  }

  if (!googleKey) {
    console.log(
      pc.yellow("  ⚠ Google API key not found. Google Calendar features will be disabled."),
    );
  }

  process.env.OPENAI_API_KEY = openaiKey;
  if (googleKey) {
    process.env.GOOGLE_API = googleKey;
  }

  console.log();
  console.log(pc.dim("  Starting WhatsApp bot... Scan the QR code when it appears."));
  console.log();

  const bot = new WhatsAppBot(username, agentName);
  bot.start();
};
