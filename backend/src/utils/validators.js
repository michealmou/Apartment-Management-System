class Validators {
    // Validate email format
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength 
    static validatePassword(password) {
        // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            return {
                valid: false,
                message: 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.',
            };
        }
        return { valid: true };
    }

    //vlidate name

    static validateName(name) {
        if (!name || name.trim().length <2) {
            return {
                valid: false,
                message: 'Name must be at least 2 characters long.',
            };
        }
        return { valid: true };
    }
    //validate registration data
    static validateRegistrationData(data) {
        const { name, email, password, phone} = data;
        if (!this.validateName(name).valid) {
            return {
                valid: false,
                message: 'invalid name. ' + this.validateName(name).message,
            };
        }
        if (!this.validateEmail(email)) {
            return {
                valid: false,
                message: 'Invalid email format.',
            };
        }
        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.valid) {
            return {
                valid: false,
                message: passwordValidation.message,
            };
        }
        return { valid: true };
    }
    //validate login data
    static validateLoginData(data) {
        const { email, password } = data;
        if (!this.validateEmail(email)) {
            return {
                valid: false,
                message: 'Invalid email format.',
            };
        }
        if (!password || password.trim().length === 0) {
            return {
                valid: false,
                message: 'Password is required.',
            };
        }
        return { valid: true };
    }
}

module.exports = Validators;