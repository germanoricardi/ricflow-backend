import { DataSourceOptions, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

// Função para configurar as opções do banco de dados, com a tipagem correta
export const createDatabaseConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres', // Tipo de banco de dados
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  synchronize: configService.get('database.synchronize'),
  logging: configService.get('database.logging'),
  migrations: [configService.get('database.migrations')!],
  entities: [configService.get('database.migrations')!], // Aqui você adiciona as entidades
});

// Função para criar o DataSource com as configurações
export const dataSource = new DataSource(
  createDatabaseConfig(new ConfigService()),
);
