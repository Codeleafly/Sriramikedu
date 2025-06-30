// extract.js
import fs from 'fs';
import unzipper from 'unzipper';
import { exec } from 'child_process';
import path from 'path';

const zipFilePath = 'seetup-light.zip';
const extractTo = './seetup-light';

async function extractZip() {
  console.log('📦 Extracting zip...');
  await fs.createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: extractTo }))
    .promise();
  console.log('✅ Zip extracted');
}

function runCommands() {
  const projectPath = path.join(__dirname, 'seetup-light', 'seetup');
  const command = `
    cd "${projectPath}" &&
    npm install &&
    npm run build &&
    npm run dev
  `;

  console.log('🚀 Starting project...');
  const child = exec(command, { stdio: 'inherit', shell: true });

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  child.on('exit', (code) => {
    console.log(`⚙️ Process exited with code ${code}`);
  });
}

(async () => {
  try {
    await extractZip();
    runCommands();
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
