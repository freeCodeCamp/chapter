import { name, internet } from 'faker';
import { User } from '../../../server/models';

const createUsers = async (): Promise<[User, User[]]> => {
  // TODO: add seeding admin
  const user = new User({
    email: 'foo@bar.com',
    first_name: name.firstName(),
    last_name: name.lastName(),
  });

  const others = Array.from(
    new Array(10),
    () =>
      new User({
        email: internet.email(),
        first_name: name.firstName(),
        last_name: name.lastName(),
      }),
  );

  try {
    await Promise.all([user, ...others].map((u) => u.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding users');
  }

  return [user, others];
};

export default createUsers;
