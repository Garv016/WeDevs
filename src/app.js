const express = require("express")

const app = express();


// app.use("/user/login",(req,res) =>{
//     throw new Error("Login page not avl")
//     res.send("Login Page")
// }) 

// Another good way is to use Try Catch
app.use("/user/login",(req,res) =>{
    try {
        throw new Error("Login page not avl")
        res.send("Login Page")
    } catch (error) {
        res.status(500).send(`hi ${error}`)
    }
    
}) 

app.use("/" , (err,req,res,next) => {
    if(err){
        // res.status(500).send("Something went wrong")
        res.send(err.message)
    }
})



const port = 7777
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

console.log("This is app");
