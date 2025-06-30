// unzip.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';

const zipFile = 'seetup-light.zip';
const extractFolder = 'seetup';

async function unzipAndSetup() {
  console.log(`🔍 Checking if ${zipFile} exists...`);
  if (!fs.existsSync(zipFile)) {
    console.error(`❌ ZIP file "${zipFile}" not found.`);
    process.exit(1);
  }

  console.log(`📦 Extracting ${zipFile}...`);
  await fs.createReadStream(zipFile)
    .pipe(unzipper.Extract({ path: extractFolder }))
    .promise();

  console.log(`📁 Changing to ${extractFolder} directory...`);
  process.chdir(path.join(process.cwd(), extractFolder));

  console.log(`📥 Installing dependencies...`);
  execSync('npm install', { stdio: 'inherit' });

  try {
    console.log(`🛠️ Building project...`);
    execSync('npm run build', { stdio: 'inherit' });

    console.log(`🚀 Starting production server...`);
    execSync('npm run start', { stdio: 'inherit' });
  } catch (err) {
    console.warn(`⚠️ Build or Start failed! Trying fallback 'npm run dev'...`);
    try {
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (devErr) {
      console.error('❌ All start methods failed. Exiting.');
      process.exit(1);
    }
  }
}

unzipAndSetup().catch(err => {
  console.error('❌ Error during setup:', err);
  process.exit(1);
});
