// unzip.js
const fs = require('fs');
const unzipper = require('unzipper');
const { exec } = require('child_process');
const path = require('path');

const zipFilePath = 'seetup-light.zip';
const extractTo = './seetup-light';

function extractZip() {
  console.log('📦 Extracting zip...');
  return fs.createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: extractTo }))
    .promise();
}

function runCommands() {
  const projectPath = path.join(__dirname, 'seetup-light', 'seetup');
  const command = `
    cd "${projectPath}" &&
    npm install &&
    npm run build &&
    npm run dev
  `;

  console.log('🚀 Running build commands...');
  const child = exec(command, { shell: true });

  child.stdout.on('data', (data) => process.stdout.write(data));
  child.stderr.on('data', (data) => process.stderr.write(data));

  child.on('exit', (code) => {
    console.log(`⚙️ Process exited with code ${code}`);
  });
}

(async () => {
  try {
    await extractZip();
    console.log('✅ Zip extracted');
    runCommands();
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
