import * as bcrypt from 'bcrypt';

/**
 * 
 * @param plainTextPassword password to be hashed
 * @returns string hashed password
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
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

export async function comparePassword(
    plainTextPassword: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hash);
}