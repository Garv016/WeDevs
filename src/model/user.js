const mongoose = require("mongoose")
const validator = require("validator")  
// SCHEMA INCLUDES ALL THE STUFF WE GONNA ADD TO USER COLLECTION

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        maxLength : 10
    },
    lastName : {
        type : String,
        maxLength : 10
    },
    gender : {
        type : String,
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} is not supported'
        }
        // Manual validator way
        // validate(value) {
        //     if(!["male","female"].includes(value)){
        //         throw new Error("Not appropriate")
        //     }
        // },
        // by default the above validate method works only when file is created not patched
        // even enum works similarly
        // so the below are necessary in app.js
        // const userData= await User.findByIdAndUpdate(
        //             req.body.id,
        //             req.body,
        //             {
        //                 new : true,
        //                 runValidators : true
        //             }
        //         ) 
        
    },
    age : {
        type : Number,
        required : true,
        min : 18,
        max : 40
    },
    email : {
        type : String,
        required : true,
        unique: true,
        lowercase: true, // user can submit capital as well but mongoose converts on its own        trim: true,
        // match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"] // either this or use validator library
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid")
            }
        }
        // required → email must exist
        // unique   → no duplicate email in DB
        // match    → email must match the given pattern
    },
    about : {
        type : String,
        default : "Human",
        maxLength : 100
    },
    skills : {
        type : [String],
        default : ["belligerent","intelligent"]
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps : true})

// name of model , schema
const User = mongoose.model("User", userSchema)
module.exports = User