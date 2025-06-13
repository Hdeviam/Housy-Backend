import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EnrichedPropertyParamsController } from './enrichedPropertyParams.controller';
import { EnrichedPropertyParamsService } from './enrichedPropertyParams.service';
import { PropertiesModule } from 'src/properties/properties.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrichedPropertyParams } from 'src/entities/enrichedPropertyParams.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    HttpModule,
    PropertiesModule,
    TypeOrmModule.forFeature([EnrichedPropertyParams]),
    AuthModule,
  ],
  controllers: [EnrichedPropertyParamsController],
  providers: [EnrichedPropertyParamsService],
})
export class EnrichedPropertyParamsModule {}
