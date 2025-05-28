import fs from "fs/promises";
import simpleGit from "simple-git";
import { DB_PATH } from "../env";

(async () => {
  await fs.mkdir(DB_PATH, { recursive: true });
  const git = simpleGit(DB_PATH);
  await git.init();
})();
