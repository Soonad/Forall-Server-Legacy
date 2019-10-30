import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Mount all pipelines and global configs of the app.
export default function setupApp(app: NestFastifyApplication) {
  const options = new DocumentBuilder()
    .setTitle('Forall API')
    .setDescription('Forall API Descriptions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apidoc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
}
