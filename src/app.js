const express = require("express")
const app = express();

const connectDB = require("./config/database"); // connect to database
const User = require("./model/user");


// This helps us to handle the json data to parse through and stuff
// .use() without a route means work for all
app.use(express.json()) // middleware

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
    try{
        const userData= await User.findByIdAndUpdate(
            req.body.id,
            req.body,
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

// Taking input from postman
app.post("/signup" , async (req,res) => {
    // console.log(req.body); // if hadnt used express.json upr then woudve gotten undefined instead of data

    const user = new User(req.body); // Created a new instance of USER using the data got from API

    try{
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
