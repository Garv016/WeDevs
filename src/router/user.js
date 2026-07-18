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
        res.status(404).send("Error in finding requests")
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
        // see those who arent a connection and dont see your ownself in feed
        // and dont see of those already ignored
        const loggedInUser = req.user

        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 100
        if(limit > 100) limit = 100
        const skip = (page-1)*limit

        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        })
        .select("fromUserId toUserId")
        // .populate("fromUserId" ,"firstName")
        // .populate("toUserId","firstName")

        const hideFromFeed = new Set()

        connectionRequest.forEach((req) => {
            hideFromFeed.add(req.fromUserId),
            hideFromFeed.add(req.toUserId)
        })

        const feedShow = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        })
        .select("firstName lastName age about skills")
        .skip(skip)
        .limit(limit)
        
        res.send(feedShow)
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Something's OFF");
    }
})

module.exports = userRouter