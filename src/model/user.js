const mongoose = require("mongoose")
    
// SCHEMA INCLUDES ALL THE STUFF WE GONNA ADD TO USER COLLECTION

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
    },
    gender : {
        type : String,
        enum : ["male","female"]
    },
    age : {
        type : Number,
    },
    email : {
        type : String,
        required : true
    }
})

// name of model , schema
const User = mongoose.model("User", userSchema)
module.exports = User