import fs from "fs/promises";
import simpleGit from "simple-git";
import { DB_CONTENT_PATH, DB_PATH } from "../env";

(async () => {
  await fs.mkdir(DB_CONTENT_PATH, { recursive: true });
  const git = simpleGit(DB_PATH);
  await git.init();
})();
