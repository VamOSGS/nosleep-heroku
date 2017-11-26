const fs = require('fs');
const path = require('path');
const https = require('https');

exports.minsToMiliSecs = mins => {
  return mins * 6e4;
}

exports.noSleepRequest = (sites) => {
      sites.list.map(siteName => https.get(`https://${siteName}.herokuapp.com/`))
}

exports.updateFile = (content) => {
  fs.writeFile(path.resolve('./sites.json'), JSON.stringify(content), (err) => {
      if (err) throw err;
  });
}