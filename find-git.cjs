const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let currentDir = __dirname;
let gitDirFound = null;

for (let i = 0; i < 5; i++) {
  const checkPath = path.join(currentDir, '.git');
  console.log("Checking:", checkPath);
  if (fs.existsSync(checkPath)) {
    gitDirFound = checkPath;
    break;
  }
  const parent = path.dirname(currentDir);
  if (parent === currentDir) break;
  currentDir = parent;
}

if (gitDirFound) {
  console.log("Found .git in:", gitDirFound);
  try {
    // Run git checkout there
    const result = execSync(`git --git-dir="${gitDirFound}" --work-tree="${path.dirname(gitDirFound)}" checkout src/components/ClientPortal.tsx`, { encoding: 'utf8' });
    console.log("Git checkout result:", result);
  } catch (e) {
    console.error("Git checkout failed:", e.message);
  }
} else {
  console.log("No .git directory found anywhere!");
}
