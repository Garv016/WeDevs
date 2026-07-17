// standard
const express = require("express")
const authRouter = express.Router()

// imports 
const isValid = require("../utils/validation");
const bcrypt = require("bcrypt")
const User = require("../model/user")


// Taking input from postman
authRouter.post("/signup" , async (req,res) => {
    try{
        // Validating the data
        isValid(req);
        const {password,lastName,firstName,age,email} = req.body;
        
        // Encrypting data
        const passwordHash = await bcrypt.hash(password,10) // 10 = saltRounds
        console.log(passwordHash);
        

        const user = new User({firstName,lastName,password:passwordHash,email,age}); // Created a new instance of USER using the data got from API

        // saving user in database
        await user.save() 
        res.send("User saved successfully")

    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

authRouter.post("/login" ,async (req,res) => {
    try{
        
        const {email,password} = req.body;
        const user = await User.findOne({email})

        if(!user){
            throw new Error("Invalid Credential")
        }
        const isPasswordValid = await user.checkPassword(password)

        if(isPasswordValid){
            // JWT TOKEN creaation
            const token = await user.getJWT();

            // cookie
            res.cookie("token",token); // sending cookie: It tells the browser:"Please store this cookie."
            console.log(token);
            
            res.send("Successfully Logged in")
            // console.log("User: ", user);
            
        } else{
            throw new Error("Invalid credential")
        }

    }
    catch(err){
        res.status(400).send("Error : "+ err.message)
    }
})

authRouter.post("/logout",(req,res) => {
    res.cookie("token", "", {
        expires: new Date(0)
    });
    res.send("Succefully logged out")
})

module.exports = authRouter