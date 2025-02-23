import { CreateUserDto } from '../../../modules/users/dto/create-user.dto';
import { ISeedInterface } from './main.seed';

export const createAdminUserSeed = async ({
  name,
  action,
  dataSource,
}: ISeedInterface) => {
  const userRepository = dataSource.getRepository('User');

  switch (action) {
    case 'revert':
      await userRepository
        .delete({ userName: 'admin' })
        .then(() => console.log(`✅ ${name} successfully reverted.`));
      break;

    default:
      const createUserDto: CreateUserDto = {
        userName: 'admin',
        email: 'admin@test.com',
        password: 'qaz147852',
        isActive: true,
      };

      await userRepository
        .save(createUserDto)
        .then(() => console.log(`✅ ${name} successfully created.`));
      break;
  }
};
