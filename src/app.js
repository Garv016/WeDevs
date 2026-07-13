const express = require("express")
const app = express();

const connectDB = require("./config/database"); // connect to database
const User = require("./model/user");


// This helps us to handle the json data to parse through and stuff
// .use() without a route means work for all
app.use(express.json()) // middleware

// Taking input from postman
app.post("/signup" , async (req,res) => {
    // console.log(req.body); // if hadnt used express.json upr then woudve gotten undefined instead of data

    const user = new User(req.body); // Created a new instance of USER using the data got from API

    try{
        throw new Error("GOTCHA")
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

// Saving data from here
// app.post("/signup" , async (req,res) => {
//     const userData = {
//         firstName : "Mahendra",
//         middleName : "Singh", // doesnt matter if i add it if not in schema wont reflect n db
//         lastName : "Dhoni",
//         email : "msd@msd.in",
//         age : 46,
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
