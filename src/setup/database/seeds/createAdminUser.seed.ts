import { CreateUserDto } from '../../../modules/users/dto/create-user.dto';
import { ISeedInterface } from './main.seed';
import { envConfig as eC } from '../../configs/env.config';
import * as bcrypt from 'bcrypt';

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
        subjectId: `${eC.appSubject}:admin`,
        userName: 'admin',
        email: 'admin@test.com',
        password: await bcrypt.hash('qaz147852', 10),
        isActive: true,
      };

      await userRepository
        .save({ ...createUserDto, passwordHash: createUserDto.password })
        .then(() => console.log(`✅ ${name} successfully created.`));
      break;
  }
};
