import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bufferLogs: true});
  const config = new DocumentBuilder()
    .setTitle('Mobile Template')
    .setDescription('Mobile Template APIs description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: "*"
  })

  app.useLogger(app.get(Logger))

  await app.listen(3000);
}
bootstrap();
