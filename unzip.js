// extract.js
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

  console.log(`🛠️ Building project...`);
  execSync('npm run build', { stdio: 'inherit' });

  console.log(`🚀 Starting development server...`);
  execSync('npm run dev', { stdio: 'inherit' });
}

unzipAndSetup().catch(err => {
  console.error('❌ Error during setup:', err);
  process.exit(1);
});
