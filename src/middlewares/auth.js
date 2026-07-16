const jwt = require("jsonwebtoken");
const User = require("../model/user");

const { findById } = require("../model/user");

const userAuth = async (req,res,next)=>{
    try{
        const cookies = req.cookies

        const {token} = cookies

        if(!token){
            throw new Error("Invalid token")
        }
        // Verifying token
        // const decodedMsg = await jwt.verify(token,"LEARNING@JWT16")
        const decodedMsg = jwt.verify(token,"LEARNING@JWT16")
        
        const {_id} = decodedMsg
        const user = await User.findById(_id)
        if(!user){
            throw new Error("User doesnt exist")
        }

        req.user = user 
        next()
    }
    catch(err){
        res.status(404).send("ERROR: "+err.message)
    }
          

};


module.exports = {
    userAuth
};