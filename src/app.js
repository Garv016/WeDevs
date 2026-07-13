const express = require("express")

const app = express();


const {adminAuth , userAuth} = require("./middlewares/auth.js")
// For middleware we generally use "use"

// Handle auth middleware for all GET, POST, PATCH ETC...
app.use("/admin" , adminAuth)

app.use("/user/data" ,userAuth,(req,res) =>{
    res.send("User Here")
}) 
app.use("/user/login" ,userAuth,(req,res) =>{
    res.send("Login Page")
}) 


app.get("/admin/addUser",(req,res)=>{
    res.send("User added")
})

app.get("/admin/delUser",(req,res)=>{
    
    res.send("User Deleted")
    
})


const port = 7777
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

console.log("This is app");
