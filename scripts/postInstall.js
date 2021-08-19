/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync, spawn } = require('child_process');
const { existsSync, copyFileSync } = require('fs');
const isDocker = require('is-docker');

console.log('--------------------------');
console.log('🎉 WELCOME TO CHAPTER 🎉');
console.log('--------------------------');

const CHAPTER_REMOTE = 'freeCodeCamp/chapter.git';
let IS_ERROR = false;

if (!isDocker()) {
  install('client', () => install('server', setup));
}

function install(package, cb) {
  console.log(`Installing ${package}...`);
  const child = spawn('npm', ['i'], { cwd: package });
  child.on('error', (err) => {
    console.error(err);
  });
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function (data) {
    console.log(data);
  });
  child.on('close', function (code) {
    if (code === 0) {
      cb();
    } else {
      console.log(`Installing ${package} returned error code`, code);
    }
  });
}

function setup() {
  try {
    const rows = execSync('git remote -v', {
      encoding: 'utf-8',
    }).split('\n');

    const isFork = rows
      .filter((item) => item.startsWith('origin'))
      .every((item) => !item.includes(CHAPTER_REMOTE));

    const hasUpstreams = rows
      .filter((item) => item.startsWith('upstream'))
      .some((item) => item.includes(CHAPTER_REMOTE));

    if (isFork && !hasUpstreams) {
      console.log(
        'It seems like this is a fork, and you dont have upstream setup.',
      );
      console.log('Run "scripts/pullUpstream.sh" to setup remotes.');
    }
  } catch (e) {
    IS_ERROR = true;
    console.error(e);
  }

  // Copy .env.example to .env
  if (!existsSync('.env')) {
    console.log("You don't have a .env\nCopying .env.example to .env");

    try {
      copyFileSync('.env.example', '.env');
      console.log('Copied!');
    } catch (e) {
      IS_ERROR = true;
      console.error(`${e} occured while copying .env file`);
    }
  }

  if (!IS_ERROR) {
    console.log(
      '\nCongratulations, its almost done 🙌🏼. Run `npm run both` to start the development server.',
    );
  }
}
