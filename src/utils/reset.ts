import fs from "fs";
import path from "path";

export const resetAuth = (): void => {
  const folders: string[] = [
    ".wwebjs_auth",
    ".wwebjs_cache",
    ".wwebjs_session",
  ];

  folders.forEach((folder) => {
    const dir = path.join(process.cwd(), folder);

    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✅ Deleted ${folder}`);
      } else {
        console.log(`⚠️ ${folder} not found`);
      }
    } catch (error) {
      console.error(`❌ Error deleting ${folder}:`, error);
    }
  });

  console.log("♻️ WhatsApp session reset complete");
};

export default resetAuth;
