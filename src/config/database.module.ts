/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Client } from 'pg';

interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  synchronize: boolean;
  ssl?: any;
  extra?: any;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const logger = new Logger('DatabaseModule');
        const RETRY_DELAY = 3000; // 3 segundos entre reintentos
        const MAX_ATTEMPTS = 3; // Máximo de intentos

        // Configuración para AWS RDS
        const remoteConfig: DatabaseConfig = {
          type: 'postgres',
          host:
            process.env.DB_HOST ||
            'housy-cluster.c0z0coi28tap.us-east-1.rds.amazonaws.com',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'housy_2025',
          database: process.env.DB_NAME || 'housy',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
          ssl: { rejectUnauthorized: false },
          extra: {
            ssl: { require: true, rejectUnauthorized: false },
            connectionTimeoutMillis: 5000, // 5 segundos de timeout
          },
        };

        // Configuración local
        const localConfig: DatabaseConfig = {
          type: 'postgres',
          host: process.env.LOCAL_DB_HOST || 'localhost',
          port: parseInt(process.env.LOCAL_DB_PORT || '5432', 10),
          username: process.env.LOCAL_DB_USERNAME || 'postgres',
          password: process.env.LOCAL_DB_PASSWORD || 'postgres',
          database: process.env.LOCAL_DB_NAME || 'housy_local',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
          ssl: undefined,
          extra: undefined,
        };

        // Función mejorada para probar conexión con reintentos
        const testConnection = async (
          config: DatabaseConfig,
          isRemote: boolean,
        ) => {
          let lastError: Error | null = null;

          for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            const client = new Client({
              host: config.host,
              port: config.port,
              user: config.username,
              password: config.password,
              database: config.database,
              ssl: config.ssl || false,
              connectionTimeoutMillis: 5000,
            });

            try {
              await client.connect();
              await client.query('SELECT 1');
              await client.end();

              logger.log(
                `✅ Conexión exitosa con ${isRemote ? 'AWS RDS' : 'PostgreSQL local'}`,
              );
              return true;
            } catch (error) {
              lastError = error;
              logger.warn(
                `⚠️ Intento ${attempt} - Error en ${isRemote ? 'RDS' : 'local'}: ${error.message}`,
              );

              if (attempt < MAX_ATTEMPTS) {
                await new Promise((resolve) =>
                  setTimeout(resolve, RETRY_DELAY),
                );
              }
            } finally {
              try {
                await client.end();
              } catch (e) {
                logger.error('Error al cerrar conexión:', e);
              }
            }
          }

          throw (
            lastError ||
            new Error(`No se pudo conectar después de ${MAX_ATTEMPTS} intentos`)
          );
        };

        // Primero intentamos conectar a RDS
        try {
          if (await testConnection(remoteConfig, true)) {
            return remoteConfig;
          }
        } catch (remoteError) {
          logger.error(
            `❌ No se pudo conectar a la base remota después de ${MAX_ATTEMPTS} intentos`,
          );

          // Si falla RDS, intentamos con local
          try {
            logger.log('🔁 Intentando conectar a la base de datos local...');
            if (await testConnection(localConfig, false)) {
              return localConfig;
            }
          } catch (localError) {
            logger.error(
              `❌ No se pudo conectar a la base local después de ${MAX_ATTEMPTS} intentos`,
            );
            throw new Error('No se pudo conectar a ninguna base de datos');
          }
        }

        throw new Error('No se pudo establecer conexión');
      },
    }),
  ],
})
export class DatabaseModule {}
