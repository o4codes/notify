import dotenv from 'dotenv';

dotenv.config();

const Settings = {
    port: process.env.API_PORT || '3000',
    isDebug: JSON.parse(process.env.IS_DEBUG || 'true'),
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT || '0', 10),
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || '',
    sourceEmail: process.env.SES_SOURCE_EMAIL || '',
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
}

export default Settings;