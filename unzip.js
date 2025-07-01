// unzip.js
const fs = require('fs');
const unzipper = require('unzipper');

fs.createReadStream('cd-seetup.zip')
  .pipe(unzipper.Extract({ path: './' }))
  .on('close', () => {
    console.log('✅ ZIP extracted!');
  });
