import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';

@Module({
    imports:[
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
            name:'default',
            inject: [config.KEY],
            useFactory: (cfg : ConfigType<typeof config>)=>{
                const {sqlite} = cfg;
                return{
                    type: 'sqlite',
                    database: sqlite.dbName,
                    synchronize: true,
                    autoLoadEntities: true,
                }
            }
        })
    ],
    providers: [],
    exports: [],
})
export class DatabaseModule {}