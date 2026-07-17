// standard
const express = require("express")
const userRouter = express.Router()

// imports
const User = require("../model/user")
const { userAuth } = require("../middlewares/auth")

// FEED API - GET all the users info
userRouter.get("/user/feed" , userAuth, async (req,res) =>{
    try{
        const userData= await User.find({}) 
        if(userData.length === 0){
            res.status(404).send("No user")
        }
        else {
            res.send(userData)
            console.log("ALL users fetched successfully");
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something's OFF");
    }
})

module.exports = userRouter