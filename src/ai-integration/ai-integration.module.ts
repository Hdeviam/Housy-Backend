import { Module } from '@nestjs/common';
import { PropertiesModule } from 'src/properties/properties.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module'; // 👈 Importa AuthModule
import { AiIntegrationController } from './ai-integration.controller';
import { AiIntegrationService } from './ai-integration.service';

@Module({
  imports: [HttpModule, PropertiesModule, AuthModule],
  controllers: [AiIntegrationController],
  providers: [AiIntegrationService],
})
export class AiIntegrationModule {}
