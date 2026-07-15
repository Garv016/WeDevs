const validator = require("validator")

const isValid = (req) => {
    const {firstName, lastName, age, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Invalid Name");
    }
    else if(!email && !validator.isEmail(email)){
        throw new Error("Invalid email")
    }
    else if(!password && !validator.isStrongPassword(password)){
        throw new Error("Enter a stronger password")
    }
}

module.exports = isValid