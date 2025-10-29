import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ---  ---
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });

  // --- Global validation ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // --- Swagger setup ---
  const config = new DocumentBuilder()
    .setTitle('TaskForge API')
    .setDescription(
      'TaskForge is a modular full-stack task management API built with NestJS, Prisma, and TypeScript. Features clean architecture, versioned routes, and modern validation.',
    )
    .addTag('Users', 'User management and profiles')
    .addTag('Projects', 'Project management features')
    .addTag('Tasks', 'Task tracking and lifecycle management')
    .addTag('Activity', 'User and system activity logs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
    },
  });

  // --- Server listen ---
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 API running at http://localhost:${port}`);
  console.log(`📘 Swagger docs available at http://localhost:${port}/docs`);
}

void bootstrap();
