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

const validateEmailEdit = (req) => {
    const { id, ...data } = req.body;
    
    
    const ALLOWED_FIELDS = [
    "lastName" , "skills" ,"about", "age"
    ]
    const isAllowed = Object.keys(data).every(
        (k) => ALLOWED_FIELDS.includes(k)
    );

    if(!isAllowed) {
        throw new Error("Only the fields below can be updated \n" + ALLOWED_FIELDS )
    }
    if ((data.skills)?.length > 5) {
        throw new Error("Max 5 skills allowed");
    }        
    
}

module.exports = {isValid , validateEmailEdit}