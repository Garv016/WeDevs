const express = require("express")
const app = express();

const connectDB = require("./config/database"); // connect to database
const User = require("./model/user");
const isValid = require("./utils/validation.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth.js");


// This helps us to handle the json data to parse through and stuff
// .use() without a route means work for all
app.use(express.json()) // middleware
app.use(cookieParser());

// Taking input from postman
app.post("/signup" , async (req,res) => {
    // console.log(req.body); // if hadnt used express.json upr then woudve gotten undefined instead of data

    
    try{
        // Validation the data
        isValid(req);
        const {password,lastName,firstName,age,email} = req.body;
        
        // Encrypting data
        const passwordHash = await bcrypt.hash(password,10)
        console.log(passwordHash);
        

        const user = new User({firstName,lastName,password:passwordHash,email,age}); // Created a new instance of USER using the data got from API

        // throw new Error("GOTCHA")
        await user.save() 
        // console.log("User saved Successfully");
        res.send("User saved successfully")

    }
    catch(err){
        // console.log("Error: ",err);
        // res.send("Error: ",err); // wont show err
        res.status(400).send("Error: " + err.message);
    }
    
})

app.post("/login" ,async (req,res) => {
    // RAN IT ONCE TO ADD PASS TO ALL OLD USERS
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

// /profile api
app.get("/profile" , userAuth,async (req,res) =>{

    try{

        const user = req.user
        res.send("User with name " + user.firstName + " found" + user);
    
        // res.send("Cookie received")
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
    

}) 

app.post("/sendConnectionRequest",userAuth, (req,res) =>{
    const user = req.user
    res.send(user.firstName + " wants to connect")
})

// GET /user using mail
app.get("/user" , async (req,res) =>{
    try{
        const userEmail = await User.findOne({email : req.body.email})
        // findOne gives one back find gives all that correspond with the requirement
        if(userEmail.length === 0){
            res.status(404).send("User not found")
        }
        else res.send(userEmail)

    }
    catch(err){
        res.send("Something's OFF");
    }
})


// FEED API - GET all the users info
app.get("/feed" , async (req,res) =>{
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

// DELETE API using id
app.delete("/delete" , async (req,res) =>{
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


// Update user API
app.patch("/user" , async (req,res) =>{

    // RAN IT ONCE TO ADD PASS TO ALL OLD USERS
    // const users = await User.find({
    //     password: { $exists: false }
    // });

    // for (const user of users) {
    //     user.password = `${user.firstName}@123`;
    //     await user.save();
    // }
    // const data = req.body; // stores id
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
        if(data?.skills.length > 5){
            throw new Error("Max 5 skills allowed")
        }
    
        const userData= await User.findByIdAndUpdate(
            req.body.id,
            data,
            {
                new : true,
                runValidators : true
            }
        ) 
        // can add in above as options { new: true, runValidators: true }
        if(!userData.length === 0){
            res.status(404).send("No user")
        }
        else {
            res.send(userData)
            console.log("User Updated successfully");
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})


// // Saving data from here
// app.post("/signup" , async (req,res) => {
//     const userData = {
//         firstName : "Rohit",
//         // middleName : "Singh", // doesnt matter if i add it if not in schema wont reflect n db
//         lastName : "Sharma",
//         email : "rs@rs.in",
//         age : 39,
//         gender : "male",
//         // _id : "507f1f77bcf86cd799439011"
//     }
//     const user = new User(userData)
//     await user.save()
    
//     res.send("User saved successfully")
// })

connectDB()
.then(() => {
    console.log("Succefully connected");
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })
})
.catch((err) =>{
    console.error("Error Caught", err);
    
})

    

const port = 7777


console.log("This is app");
