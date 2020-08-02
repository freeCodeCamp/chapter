import { name } from 'faker';
import { User } from '../../../server/models';

const createUsers = async (): Promise<User[]> => {
  // TODO: add seeding admin
  const user = new User({
    email: 'foo@bar.com',
    first_name: name.firstName(),
    last_name: name.lastName(),
  });

  try {
    await user.save();
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding users');
  }

  return [user];
};

export default createUsers;
