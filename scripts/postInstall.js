/* eslint-disable @typescript-eslint/no-var-requires */
const { existsSync, copyFile } = require('fs');
const { execSync } = require('child_process');

console.log('--------------------------');
console.log('');
console.log('🎉 WELCOME TO CHAPTER 🎉');
console.log('');
console.log('--------------------------');

if (!existsSync('.env')) {
  console.log("You don't have a .env. Copying demo");
  copyFile('.env.example', '.env', err => {
    if (err) {
      console.error('Error coping env file');
      return;
    }

    console.log('Done');
  });

  console.log('');
}

const CHAPTER_REMOTE = 'freeCodeCamp/chapter.git';

try {
  const rows = execSync('git remote -v', {
    encoding: 'utf-8',
  }).split('\n');

  const isFork = rows
    .filter(item => item.startsWith('origin'))
    .every(item => !item.includes(CHAPTER_REMOTE));

  const hasUpstreams = rows
    .filter(item => item.startsWith('upstream'))
    .some(item => item.includes(CHAPTER_REMOTE));

  if (isFork && !hasUpstreams) {
    console.log(
      'It seems like this is a fork, and you dont have upstream setup.',
    );
    console.log('Run "scripts/pullUpstream.sh" to setup remotes.');
  }
} catch (e) {
  console.error(e);
}

console.log('');
