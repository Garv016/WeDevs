// standard
const expres = require("express")
const requestRouter = expres.Router()
const ConnectionRequest = require("../model/connectionRequest.js")
const User = require("../model/user");
// imports
const { userAuth } = require("../middlewares/auth.js");
const connectionRequestModel = require("../model/connectionRequest.js");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) =>{
    try{
        const user = req.user
        const status = req.params.status
        const toUserId = req.params.toUserId
        const fromUserId = user._id

        const statusSend = ["ignored","interested"]

        // check status
        if(!statusSend.includes(status)){
            return res.status(400).send("Status Invalid")
        }

        // check if toUserId exist in database or not
        const toUserExist = await User.findOne({_id : toUserId})
        if(!toUserExist) throw new Error("Cant connect")


        // check duplicate connection
        const existingConnection = await ConnectionRequest.findOne({
            $or : [
                {fromUserId , toUserId},
                {fromUserId:toUserId , toUserId:fromUserId}
            ]
        }
        )
        if(existingConnection){
            throw new Error("Connection already exist")
        }
        
        // save connection
        const connection = new ConnectionRequest({
            fromUserId : fromUserId,
            toUserId : toUserId,
            status : status
        })

        await connection.save();

        res.json({
            message: `${user.firstName} wants to connect`,
            connection
        });
    }
    catch(err){
        res.status(400).json(
            {Error : err.message}
        )
    }
    
})

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res) => {

    try{
        // requestId should be valid
        // loggedInUser === toUserId

        const loggedInUser = req.user
        const {status,requestId} = req.params
        // checking status
        const allowedStatus = ["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Status Invalid")
        }

        // checking if connectionRequest present and status interested
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId: loggedInUser._id,
            status : "interested"
        })

        if(!connectionRequest){
            return res
                .status(404)
                .json({message : "Connection not found"})
        }

        connectionRequest.status = status

        const data = await connectionRequest.save()
        console.log("Done");
        
        res.json({
            message: `Connection request ${status}`,
            data
        });

    }
    catch(err){
        res.status(400).json(
            {Error : err.message}
        )
    }
    
})

module.exports = requestRouter