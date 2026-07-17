// standard
const expres = require("express")
const requestRouter = expres.Router()
const connectionRequest = require("../model/connectionRequest.js")
const User = require("../model/user");
// imports
const { userAuth } = require("../middlewares/auth.js");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) =>{
    try{
        const user = req.user
        const status = req.params.status
        const toUserId = req.params.toUserId
        const fromUserId = user._id

        const statusSend = ["ignored","interested"]

        // check status
        if(!statusSend.includes(status)){
            throw new Error("Invalid status")
        }

        // check if toUserId exist in database or not
        const toUserExist = await User.findOne({_id : toUserId})
        if(!toUserExist) throw new Error("Cant connect")


        // check duplicate connection
        const existingConnection = await connectionRequest.findOne({
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
        const connection = new connectionRequest({
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



module.exports = requestRouter