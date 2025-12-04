import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath:
        process.env.NODE_ENV === 'prod'
          ? '.prod.env'
          : process.env.NODE_ENV === 'stg'
          ? '.stg.env'
          : '.env',
    }),

    TypeOrmModule.forRootAsync({
      name: 'default',
      inject: [config.KEY],
      useFactory: (cfg: ConfigType<typeof config>) => {
        const { postgres } = cfg;

        return {
          type: 'postgres',
            host: postgres.host,
            port: postgres.port,
            username: postgres.user,
            password: postgres.password,
            database: postgres.dbName,
            synchronize: true,
            autoLoadEntities: true,
            ssl: {
                rejectUnauthorized: false,   // <<----- OBLIGATORIO PARA RDS
            },
        };
      },
    }),
  ],
  exports: [],
})
export class DatabaseModule {}
