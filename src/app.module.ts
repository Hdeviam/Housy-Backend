import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [AuthModule, UsersModule, PropertiesModule, AuthModule, DatabaseModule, LeadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
