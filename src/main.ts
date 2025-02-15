import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS Configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    methods: configService.get<string>('CORS_METHODS'),
    allowedHeaders: configService.get<string>('CORS_ALLOWED_HEADERS'),
  });

  // Helmet for HTTP Security (Protection of HTTP Headers)
  app.use(helmet());

  const port = configService.get<number>('APP_PORT')!;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();
