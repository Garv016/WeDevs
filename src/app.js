const express = require("express")

const app = express();

// app.use(Route,route_handler)
app.use("/user" , (req,res,next) =>{
    // Route Handler
    res.send("Route Handles number 1");
    console.log("Handling route 1");
    // even if we remove above res.send() still it doesnt go to 2nd route handler and keeps tring to send response
    // it will be send if we call next() like below
    next()

    // Also when using next() if we hv got res.sned() and next() and the next one also has
    // a res.send() then it throws an erorr
    // Since, the callstack executes the res.send() of 1st handler so the tcp connection formed has now sent
    // the response back and is now closed and lost
    // so when we try to send it back again in he 2nd handler it throws an error

},
(req,res,next) => {
    // next();
    console.log("Handling route 2");
    // res.send("Route Handles number 2");    
}
// ,
// (req,res) =>{
//     console.log("Handling route 3");
//     res.send("Handler 3")
// }
)

// if empty Route handler since we are not actually sending any 
// actual response from the server so it just keeps try to send
// a response but after a while we hit timeout and nothing is sent 
// app.use("/",(req,res)=>{
//     console.log("Keeps sending req");
// })

const port = 7777
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

console.log("This is app");
