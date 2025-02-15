export default () => ({
  appPort: Number(process.env.APP_PORT) || 3000,

  database: {
    database: process.env.DB_NAME,
    entities: process.env.DB_ENTITIES,
    host: process.env.DB_HOST,
    logging: process.env.DB_LOGGING === 'true',
    migrations: process.env.DB_MIGRATIONS,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    sincronize: process.env.DB_SYNCHRONIZE === 'true',
    type: process.env.DB_TYPE,
    username: process.env.DB_USERNAME,
  },
});
