import { DataSource } from 'typeorm';
import Settings from './settings';

export const MainDataSource = new DataSource({
    type: 'postgres',
    host: Settings.dbHost,
    port: Settings.dbPort,
    username: Settings.dbUser,
    password: Settings.dbPassword,
    database: Settings.dbName,
    synchronize: Settings.isDebug,
});
