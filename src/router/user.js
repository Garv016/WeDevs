// standard
const express = require("express")
const userRouter = express.Router()

// imports
const User = require("../model/user")
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../model/connectionRequest")

// GET pending requests received
userRouter.get("/user/requests/received" , userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        })
        .populate("fromUserId" , "lastName firstName age")
        // .populate("fromUserId" , ["lastName","firstName","age"])

        if(connectionRequests.lentgh===0){
            return res.send("No pending requests found")
        }

        res.json({
            message : "Connection requests found",
            data : connectionRequests
        })
    }
    catch(err){
        res.statusCode(404).send("Error in finding requests")
    }
})

// GET my connections
userRouter.get("/user/connections",userAuth,async (req,res) => {
    try{
        const loggedInUser = req.user
        const connections = await ConnectionRequest.find({
            $or : [
                {toUserId: loggedInUser._id,status : "accepted"},
                {fromUserId: loggedInUser._id,status : "accepted"}
            ]
        })
        .populate("fromUserId","firstName about")
        .populate("toUserId","firstName about")

        const data = connections.map((row) => {
            if(row.fromUserId.toString() === loggedInUser._id.toString()){
                // row.fromUserId._id.equals(loggedInUser._id)
                return row.toUserId;
            }
            return row.fromUserId
        });
        // Go through every element in connections and create a new array containing only the fromUserId of each element.
        
        res.json({
            message : "There are your connections",
            data : data
            }
        )
    }
    catch(err){
        res.status(400).send("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
    }
})

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