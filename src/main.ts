import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const isProd = process.env.NODE_ENV === 'production' 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('User/Hobbies API')
    .setVersion('1.0')
    .addTag('users')
    .addTag('hobbies')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  app.enableCors({
    origin: true,
    methods: ['GET','POST','PUT','DELETE'],
    credentials: isProd
  });
  app.use(helmet());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();