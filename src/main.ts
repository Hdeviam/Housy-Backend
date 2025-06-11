import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ✅ Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Inmobiliaria API')
    .setDescription(
      'API para gestión de propiedades inmobiliarias - Plataforma Housy para alquiler y venta de casas',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);

  console.log(`
🚀 Servidor iniciado correctamente
🔧 Puerto: ${PORT}
🏢 Proyecto: Housy - Plataforma Inmobiliaria
📅 Inicio del desarrollo: 4 de junio de 2025
🔗 Documentación disponible en: http://localhost:${PORT}/api
`);
}

void bootstrap();
