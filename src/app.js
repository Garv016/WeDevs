const express = require("express")

const app = express();

// matches /abc and /ab

// Doesnt work for express 5 ver
// app.use("/ab?c" , (req,res) => {
//     res.send("This is abc")
// })

// Routing regex

app.use(/^\/abc?$/, (req, res) => {
    console.log(req.query   )
    res.send("Matched /ab or /abc");
});

app.use(/^\/wx.*yz$/, (req, res) => {
    res.send("Matched!");
});

const port = 7777
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

console.log("This is app");
