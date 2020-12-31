import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as congig from 'config';

async function bootstrap() {
  const serverConfig = congig.get('server');
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application is listening on PORT ${port}`);
}
bootstrap();
