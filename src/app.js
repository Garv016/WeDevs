const express = require("express")
const app = express();

const connectDB = require("./config/database"); // connects to database
// const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authRouter = require("./router/auth")
const profileRouter = require("./router/profile")
const requestRouter = require("./router/request")
const userRouter = require("./router/user")


// middleware
app.use(express.json())
app.use(cookieParser());

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)


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
