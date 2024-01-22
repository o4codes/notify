import { DataSource } from 'typeorm';
import Settings from './settings';
import { logger } from './logger';
import { UserEntity, UserSecurityKeysEntity } from '../models';

export const MainDataSource = new DataSource({
    type: 'postgres',
    host: Settings.dbHost,
    port: Settings.dbPort,
    username: Settings.dbUser,
    password: Settings.dbPassword,
    database: Settings.dbName,
    synchronize: Settings.isDebug,
    entities: [
        UserEntity, UserSecurityKeysEntity
    ],
});


MainDataSource.initialize()
    .then(() => {
        logger.info('Data Source has been initialized!');
    })
    .catch((err) => {
        logger.error('Error during Data Source initialization:', err);
    });