import { DataSource } from 'typeorm';
import { dataSource } from '../../configs/typeorm.config';
import { createAdminUserSeed } from './createAdminUserSeed';

export interface ISeedInterface {
  name?: string;
  action?: 'create' | 'revert';
  dataSource: DataSource;
}

async function seed() {
  const config: ISeedInterface = {
    name: process.env.npm_config_name!,
    action: process.env.npm_config_action as ISeedInterface['action'],
    dataSource,
  };

  await config.dataSource
    .initialize()
    .then(() => console.log('✅ Database connection established.'));

  // seeds
  if (config.name === 'createAdminUserSeed') await createAdminUserSeed(config);

  await config.dataSource
    .destroy()
    .then(() => console.log('✅ Database connection closed.'));
}

seed().catch((err) => {
  console.error('❌ Unexpected error during seed execution:', err);
  process.exit(1);
});
