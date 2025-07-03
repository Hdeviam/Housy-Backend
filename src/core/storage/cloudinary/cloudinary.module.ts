// src/core/storage/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { STORAGE_SERVICE } from '../storage.interface';

@Module({
  imports: [
    ConfigModule, // ConfigService es necesario en CloudinaryService.
                  // Si ConfigModule.forRoot() es global en AppModule, esta importación
                  // podría no ser estrictamente necesaria aquí, pero no hace daño.
  ],
  providers: [
    {
      provide: STORAGE_SERVICE, // Cualquier clase que pida STORAGE_SERVICE...
      useClass: CloudinaryService, // ...recibirá una instancia de CloudinaryService.
    },
    // Opcionalmente, puedes también proveer CloudinaryService directamente si necesitas
    // inyectarlo explícitamente como CloudinaryService en algún lugar,
    // aunque el objetivo principal es usar la abstracción IStorageService.
    // CloudinaryService,
  ],
  exports: [
    STORAGE_SERVICE, // Esto permite que otros módulos que importen CloudinaryStorageModule
                     // puedan inyectar IStorageService usando @Inject(STORAGE_SERVICE).
    // CloudinaryService, // Descomenta si también necesitas exportar la clase concreta.
  ],
})
export class CloudinaryStorageModule {}
