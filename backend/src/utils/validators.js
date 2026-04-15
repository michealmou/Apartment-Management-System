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
    static validateTenantData(data, isUpdate = false) {
        const {
            name,
            email,
            phone,
            unit_number,
            unit_type,
            lease_start_date,
            lease_end_date,
            rent_amount,
            deposit_amount,
        } = data;
        // name validation
        if(!isUpdate || name !== undefined){
            if (!name || name.trim().length < 2) {
                return {
                    valid: false,
                    message: 'Name must be at least 2 characters long.',
                };
            }
        }
        // email validation
        if(!isUpdate || email !== undefined){
            if (!email || !this.validateEmail(email)) {
                return {
                    valid: false,
                    message: 'Invalid email format.',
                };
            }
        }
        // phone validation
        if(!isUpdate || phone !== undefined){
            if (phone && !/^[\d\s\-\+\(\)]{7,}$/.test(phone)) {
                return {
                    valid: false,
                    message: 'Invalid phone number format.',
                };
            }
        }
        // unit number validation
        if(!isUpdate || unit_number !== undefined){

            if (!unit_number || unit_number.trim().length === 0) {
                return {
                    valid: false,
                    message: 'Unit number is required.',
                };
            }
        }
        //data validation
        if(!isUpdate || lease_start_date !== undefined || lease_end_date !== undefined){
            const start = lease_start_date ? new Date(lease_start_date) : null;
            const end = lease_end_date ? new Date(lease_end_date) : null;
            if (start && isNaN(start.getTime())) {
                return {
                    valid: false,
                    message: 'Invalid lease start date.',
                };
            }
            if (end && isNaN(end.getTime())) {
                return {
                    valid: false,
                    message: 'Invalid lease end date.',
                };
            }
            if (start && end && start >= end) {
                return {
                    valid: false,
                    message: 'Lease start date must be before end date.',
                };
            }
        }
        //amount validation
        if(!isUpdate || rent_amount !== undefined){
            if (rent_amount && (isNaN(rent_amount) || parseFloat(rent_amount) <= 0)) {
                return {
                    valid: false,
                    message: 'Rent amount must be a positive number.',
                };
            }
        }
        if(!isUpdate || deposit_amount !== undefined){
            if (deposit_amount && (isNaN(deposit_amount) || parseFloat(deposit_amount) < 0)) {
                return {
                    valid: false,
                    message: 'Deposit amount must be a non-negative number.',
                };
            }
        }
        return { valid: true };
    }
}

module.exports = Validators;