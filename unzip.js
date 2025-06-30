// extract.js
import { execSync } from 'child_process';
import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';

const zipFile = 'seetup-light.zip';
const extractTo = 'seetup1';

async function unzipProject() {
  console.log(`🔓 Unzipping ${zipFile}...`);

  await fs
    .createReadStream(zipFile)
    .pipe(unzipper.Extract({ path: extractTo }))
    .promise();

  console.log(`✅ Extracted to ${extractTo}`);
}

function runCommands() {
  const projectPath = path.join(extractTo, 'seetup');
  if (!fs.existsSync(projectPath)) {
    console.error(`❌ Folder "${projectPath}" not found after unzip.`);
    process.exit(1);
  }

  try {
    console.log(`📦 Installing dependencies in ${projectPath}...`);
    execSync(`npm install`, { stdio: 'inherit', cwd: projectPath });

    console.log(`🛠️ Building project...`);
    execSync(`npm run build`, { stdio: 'inherit', cwd: projectPath });

    console.log(`🚀 Starting dev server...`);
    execSync(`npm run dev`, { stdio: 'inherit', cwd: projectPath });
  } catch (err) {
    console.error(`❌ Error during project setup:`, err.message);
    process.exit(1);
  }
}

(async () => {
  await unzipProject();
  runCommands();
})();
