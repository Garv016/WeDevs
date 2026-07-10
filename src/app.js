const express = require("express")

const app = express();

app.use( "/" ,(req,res) => {
    res.send("Nodemon is the best")
} )
// "/test" this is called as route if we dont add this then 
// we will be getting response for all routes of the port
app.use( "/test" ,(req,res) => {
    res.send("This func is called as request handler")
} )
app.use( "/me" ,(req,res) => {
    res.send("Who am I?")
} )

const port = 7777
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

console.log("This is app");
