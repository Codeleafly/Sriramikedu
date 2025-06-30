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
      .pipe(unzipper.Extract({ path: '.' }))
      .promise();

    const projectPath = path.join(process.cwd(), extractFolder);
    console.log(`📁 Changing to ${projectPath}...`);
    process.chdir(projectPath);

    if (!fs.existsSync("package.json")) {
      throw new Error("❌ package.json file not found in extracted folder.");
    }

    console.log(`📥 Installing dependencies...`);
    execSync('npm install', { stdio: 'inherit' });

    if (fs.existsSync("index.cjs")) {
      console.log(`🚀 Found index.cjs, running it with node...`);
      execSync(`node index.cjs`, { stdio: 'inherit' });
      return;
    }

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const scripts = pkg.scripts || {};

    if ('build' in scripts) {
      console.log(`🛠️ Running 'build' script...`);
      execSync('npm run build', { stdio: 'inherit' });
    }

    if ('start' in scripts) {
      console.log(`🚀 Running 'start' script...`);
      execSync('npm run start', { stdio: 'inherit' });
    } else if ('dev' in scripts) {
      console.log(`🚧 Running fallback 'dev' script...`);
      execSync('npm run dev', { stdio: 'inherit' });
    } else {
      console.error(`❌ No 'start' or 'dev' script found in package.json.`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Setup failed: ${err.message}`);
    process.exit(1);
  }
}

unzipAndSetup();
