// unzip.js
const fs = require('fs');
const unzipper = require('unzipper');

async function extractZip() {
  console.log("🔄 Extracting ZIP...");
  await fs.createReadStream('cd-seetup.zip')
    .pipe(unzipper.Extract({ path: './' }))
    .promise();
  console.log("✅ ZIP Extracted!");
}

extractZip().catch(err => {
  console.error("❌ Extraction failed:", err);
  process.exit(1);
});
