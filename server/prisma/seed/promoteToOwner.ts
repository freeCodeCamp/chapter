import { InstanceRoles } from '../../../common/roles';
import { prisma } from '../../src/prisma';

prisma.instance_roles
  .findUniqueOrThrow({ where: { name: InstanceRoles.owner } })
  .then((ownerRole) => {
    if (!ownerRole) {
      console.log('Owner role not found');
    } else {
      console.log('Promoting user to owner');
      return prisma.users
        .updateMany({
          data: { instance_role_id: ownerRole.id },
        })
        .then(() => console.log('Done'));
    }
  });
