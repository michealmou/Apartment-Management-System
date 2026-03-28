const bcrypt = require('bcryptjs');
const PasswordUtils = require('../../src/utils/passwordUtils');

describe('Password Utilities', () => {
    describe('hashPassword', () => {
        it('should hash a password correctly', async () => {
            const password = 'qwertyui88';
            const hashed = await PasswordUtils.hashPassword(password);

            expect(hashed).toBeDefined();
            expect(hashed).not.toBe(password);
            expect(hashed.length).toBeGreaterThan(20); // bcrypt hashes are typically 60 characters
        });

        it('should produce different hashes for the same password', async () => {
            const password = 'qwertyui88';
            const hash1 = await PasswordUtils.hashPassword(password);
            const hash2 = await PasswordUtils.hashPassword(password);

            expect(hash1).not.toBe(hash2); // Due to salting, hashes should be different
        });

        it('should throw error for empty passwords', async () => {
            const password = '';
            await expect(PasswordUtils.hashPassword(password)).rejects.toThrow('Password is required');
        });

        it('should throw error for null or undefined password', async () => {
            await expect(PasswordUtils.hashPassword(null)).rejects.toThrow();
            await expect(PasswordUtils.hashPassword(undefined)).rejects.toThrow();
        });
    });

    describe('comparePassword', () => {
        let hashedPassword;

        beforeAll(async () => {
            hashedPassword = await PasswordUtils.hashPassword('qwertyui88');
        });

        it('should return true for matching passwords', async () => {
            const result = await PasswordUtils.comparePassword('qwertyui88', hashedPassword);
            expect(result).toBe(true);
        });

        it('should return false for non-matching passwords', async () => {
            const result = await PasswordUtils.comparePassword('wrongpassword', hashedPassword);
            expect(result).toBe(false);
        });

        it('should return false for empty password', async () => {
            const result = await PasswordUtils.comparePassword('', hashedPassword);
            expect(result).toBe(false);
        });

        it('should handle special characters in passwords', async () => {
            const specialPassword = 'P@$$w0rd!#';
            const specialHash = await PasswordUtils.hashPassword(specialPassword);
            const result = await PasswordUtils.comparePassword(specialPassword, specialHash);
            expect(result).toBe(true);
        });
    });
});
