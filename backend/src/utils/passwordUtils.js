const bcrypt = require('bcryptjs');

class PasswordUtils {
  /**
   * Hash a password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  static async hashPassword(password) {
    if (!password) {
      throw new Error('Password is required');
    }
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare plain text password with hashed password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} - True if passwords match
   */
  static async comparePassword(password, hashedPassword) {
    if (!password || !hashedPassword) {
      return false;
    }
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = PasswordUtils;
