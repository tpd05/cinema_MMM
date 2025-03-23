export const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};


export const validatePhone = (phone) => {
    return /^0\d{9}$/.test(phone); // Số điện thoại phải có đúng 10 số và bắt đầu bằng 0
};

export const validateRegistration = (formData) => {
    const errors = {};

    if (!formData.full_name.trim()) {
        errors.full_name = "Full name is required";
    }

    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
        errors.email = "Invalid email format";
    }

    if (!validatePhone(formData.phone)) {
        errors.phone = "Invalid phone number format";
    }

    if (!formData.username.trim()) {
        errors.username = "Username is required";
    }

    if (!formData.password.trim()) {
        errors.password = "Password is required";
    } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return errors;
};

export const validateLogin = ({ username, password }) => {
    const errors = {};

    if (!username.trim()) {
        errors.username = "Username is required";
    }

    if (!password.trim()) {
        errors.password = "Password is required";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return errors;
};

