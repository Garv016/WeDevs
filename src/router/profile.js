// standard
const express = require("express")
const profileRouter = express.Router()

// imports
const { userAuth } = require("../middlewares/auth.js");
const User = require("../model/user")
const {validateEmailEdit}  = require("../utils/validation.js");
const { isStrongPassword } = require("validator");
const bcrypt = require("bcrypt")
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
        
        validateEmailEdit(req)

        const user = req.user;
        for (const d in data) {
            user[d] = data[d];
        }
        // Object.assign(user, data); // same as for loop 

        await user.save()
        // res.send(user)
        res.json({message : `${user.firstName}, Your data has been updated successfully`,
            data : user
        })
         
    }
    catch (err) {
        
        res.status(500).send(err.message);
    }
})

// Forgot password
profileRouter.post("/profile/password", async(req,res) => {
    try{

        const {password,email,about,skills} = req.body
        // will ask for email and find the user by that email
        // then verify the about and skills and then reset the password
        const user = await User.findOne({email:email})
        if(!user){
            throw new Error("Invalid")
        }

        // check about
        if(user.about !== about ){
            throw new Error("Wrong credentials")
        }
        // check skills
        const dbSkills = user.skills.map(s => s.toLowerCase()).sort();  // map() already creates a new array, so you don't need the spread operator.
        const inputSkills = skills.map(s => s.toLowerCase()).sort();
        // const dbSkills = [...user.skills].sort(); // spread operator [...] creates a new array.
        // const inputSkills = [...skills].sort();

        const sameSkills =
            dbSkills.length === inputSkills.length &&
            dbSkills.every((skill, i) => skill === inputSkills[i]);

        if (!sameSkills) {
            throw new Error("Wrong credentials");
        }



        if(!isStrongPassword(password)){
            throw new Error("Enter a strong password")
        }
        const passwordHash = await bcrypt.hash(password,10)
        user.password = passwordHash
        console.log(password);
        
        await user.save();
        res.send("Password Updated")
    }
    catch(err){
        res.status(400).send(err.message)
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