// TODO: install ts-node and convert to typescript

const fs = require('fs');

const contents = JSON.stringify({ email: process.argv[2] });

fs.writeFile('server/dev-data.json', contents, (err) => {
  if (err) throw err;
  console.log('The dev user is now: ' + process.argv[2]);
});
