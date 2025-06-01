import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DB_PATH = path.resolve(__dirname, "db");
export const DB_CONTENT_DIR = "content";
export const DB_CONTENT_PATH = path.resolve(DB_PATH, DB_CONTENT_DIR);
export const PORT = 3000;
