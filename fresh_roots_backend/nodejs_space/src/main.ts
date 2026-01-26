import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for mobile app
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Redirect root path to API documentation
  app.use((req: any, res: any, next: any) => {
    if (req.path === '/' || req.path === '') {
      return res.redirect('/api-docs');
    }
    next();
  });

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Fresh Roots API')
    .setDescription('Backend API for Fresh Roots - Fresh Produce Marketplace in Mauritius')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Categories', 'Product categories management')
    .addTag('Listings', 'Product listings CRUD operations')
    .addTag('Interest Expressions', 'Customer interest in products')
    .addTag('Orders', 'Order management and purchase requests')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Serve Swagger UI at /api-docs
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Fresh Roots API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #10b981; }
      .swagger-ui .scheme-container { background: #f9fafb; }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  logger.log(`🏥 Health check: http://localhost:${port}/api/health`);
}

bootstrap();
