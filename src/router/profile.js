// standard
const express = require("express")
const profileRouter = express.Router()

// imports
const { userAuth } = require("../middlewares/auth.js");
const User = require("../model/user")

// Profile api -> get details of existing user using TOKEN
profileRouter.get("/profile" , userAuth,async (req,res) =>{

    try{

        const user = req.user
        res.send("User with name " + user.firstName + " found\n" + user);

    }
    catch(err){
        res.status(400).send("ERROR: " + err.message)
    }

}) 




// GET /profile/view using mail
profileRouter.get("/profile/view" , userAuth,async (req,res) =>{
    try{
        const userByEmail = await User.findOne({email : req.body.email})
        // findOne gives one back find gives all that correspond with the requirement
        if(userByEmail.length === 0){
            res.status(404).send("User not found")
        }
        else res.send(userByEmail)

    }
    catch(err){
        res.send("Something's OFF");
    }
})

// PATCH /profile/edit
profileRouter.patch("/profile/edit" ,userAuth, async (req,res) =>{

    const { id, ...data } = req.body;
    
    try{
        const ALLOWED_FIELDS = [
        "lastName" , "skills" ,"about", "age"
        ]
        const isAllowed = Object.keys(data).every(
            (k) => ALLOWED_FIELDS.includes(k)
        );

        if(!isAllowed) {
            throw new Error("Only the fields below can be updated \n" + ALLOWED_FIELDS )
        }
        if (data.skills && data.skills.length > 5) {
            throw new Error("Max 5 skills allowed");
        }
    
        const userData= await User.findByIdAndUpdate(
            id,
            data,
            {
                new : true,
                runValidators : true // this only runs in PUT by default thats why we make it true here
            }
        ) 

        if(!userData){
            res.status(404).send("No user")
        }
        else {
            res.send(userData)
            console.log("User Updated successfully");
        }

    }
    catch (err) {
        
        res.status(500).send(err.message);
    }
})

// DELETE API using id
profileRouter.delete("/profile/delete" , async (req,res) =>{
    try{
        // const userData= await User.findById({_id : req.body.id}) 
        const userData= await User.findById(req.body.id) // better way
        console.log(req.body.id);
        
        if(userData.length === 0){
            res.status(404).send("No user")
        }
        else {
            res.send(userData)
            await userData.deleteOne() // deleteOne() deletes the first document that matches the filter.   
            console.log("User deleted successfully");
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something's OFF");
    }
})

module.exports = profileRouter