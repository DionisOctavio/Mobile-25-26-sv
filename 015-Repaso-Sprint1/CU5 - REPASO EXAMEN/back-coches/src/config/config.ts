import { registerAs } from "@nestjs/config";

export default registerAs('config', () => ({
    sqlite:{
        dbName: process.env.SQLITE_DB,
        host: process.env.SQLITE_HOST,
        user: process.env.SQLITE_USER,
        password: process.env.SQLITE_PASSWORD,
    }, 
    API:{
        key: process.env.API_KEY,
        keyProd: process.env.API_KEY_PROD,
    }, 
    enviroment: process.env.NODE_ENV || 'dev',
}));
