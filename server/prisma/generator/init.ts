import createChapterRoles from './factories/chapterRoles.factory';
import createEventRoles from './factories/eventRoles.factory';
import createInstanceRoles from './factories/instanceRoles.factory';

const myArgs = process.argv.slice(2);
if (myArgs.length === 1 && myArgs[0] === '--execute') {
  createRoles();
} else if (myArgs.length === 0) {
  // do nothing, it's just being imported and will be called by the importing script
} else {
  console.error(`--To execute:
    node init.ts --execute
--All other arguments are invalid
`);
}

async function createRoles() {
  const instanceRoles = await createInstanceRoles();
  const eventRoles = await createEventRoles();
  const chapterRoles = await createChapterRoles();

  return {
    instanceRoles,
    eventRoles,
    chapterRoles,
  };
}

export default createRoles;
