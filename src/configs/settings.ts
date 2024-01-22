import dotenv from 'dotenv';

dotenv.config();


class Settings {
    static get port(): string {
        return process.env.API_PORT || '3000';
    }

    static get isDebug(): boolean {
        return JSON.parse(process.env.IS_DEBUG || 'true');
    }

    static get dbHost(): string {
        return process.env.DB_HOST || 'localhost';
    }

    static get dbPort(): number {
        return parseInt(process.env.DB_PORT || '0', 10);
    }

    static get dbUser(): string {
        return process.env.DB_USER || '';
    }

    static get dbPassword(): string {
        return process.env.DB_PASSWORD || '';
    }

    static get dbName(): string {
        return process.env.DB_NAME || '';
    }
}

export default Settings;