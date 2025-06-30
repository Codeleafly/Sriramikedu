// unzip.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';

const zipFile = 'seetup-light.zip';
const extractFolder = 'seetup';

async function unzipAndSetup() {
  try {
    console.log(`🔍 Checking if ${zipFile} exists...`);
    if (!fs.existsSync(zipFile)) {
      console.error(`❌ ZIP file "${zipFile}" not found.`);
      process.exit(1);
    }

    console.log(`📦 Extracting ${zipFile}...`);
    await fs.createReadStream(zipFile)
      .pipe(unzipper.Extract({ path: extractFolder }))
      .promise();

    const projectPath = path.join(process.cwd(), extractFolder);
    console.log(`📁 Changing to ${projectPath}...`);
    process.chdir(projectPath);

    console.log(`📥 Installing dependencies...`);
    execSync('npm install', { stdio: 'inherit' });

    const indexCjsPath = path.join(projectPath, 'index.cjs');
    if (fs.existsSync(indexCjsPath)) {
      console.log(`🚀 Found index.cjs, running it...`);
      execSync('node index.cjs', { stdio: 'inherit' });
    } else {
      console.error(`❌ index.cjs not found in ${projectPath}`);
      process.exit(1);
    }

  } catch (err) {
    console.error(`❌ Setup failed: ${err.message}`);
    process.exit(1);
  }
}

unzipAndSetup();
