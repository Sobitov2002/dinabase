export const createAdminValidation = {
    first_name: {
        notEmpty: {
            errorMessage: "First name must be not empty"
        }     
    },
    last_name: {
        notEmpty: {
            errorMessage: "Last name must be not empty"
        }
    },
    login: {
        notEmpty: {
            errorMessage: "Login must be not empty"
        },
        unique: {
            errorMessage: "Login must be unique"
        },
        option: {
            min: 5,
            errorMessage: "Login must be at least 5 characters long"
        }
    },
    password:{
        notEmpty: {
            errorMessage: "Password must be not empty"
        },
        option: {
            min: 6,
            errorMessage: "Password must be at least 6 characters long"
        }
    }
}