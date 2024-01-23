import * as bcrypt from 'bcryptjs';


export default class CryptoHandler {
    /**
     * 
     * @param plainTextPassword password to be hashed
     * @returns string hashed password
     */
    static async hashPassword(plainTextPassword: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(plainTextPassword, salt);
        return hash;
    }

    /**
     * 
     * @param plainTextPassword: password entered by user
     * @param hash alread hashed password
     * @returns boolean
     */
    static async comparePassword(
        plainTextPassword: string,
        hash: string
    ): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hash);
    }
}