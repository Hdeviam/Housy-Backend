import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { AiIntegrationModule } from './ai-integration/ai-integration.module';
import { EnrichedPropertyParamsModule } from './enrichedPropertyParams/enrichedPropertyParams.module';
import { PhotosModule } from './photos/photos.module';
import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PropertiesModule,
    AuthModule,
    DatabaseModule,
    LeadsModule,
    AiIntegrationModule,
    EnrichedPropertyParamsModule,
    PhotosModule,
    VisitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
