// standard
const expres = require("express")
const requestRouter = expres.Router()

// imports
const { userAuth } = require("../middlewares/auth.js");


requestRouter.post("/request/send",userAuth, (req,res) =>{
    const user = req.user
    res.send(user.firstName + " wants to connect")
})

module.exports = requestRouter