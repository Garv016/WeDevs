const express = require("express")

const app = express();

app.use("/user" , (req,res) => {
    res.send("Order matters hahahahahhahah")
})

// this matches only get req
app.get("/user", (req, res) => {
    res.send({
        message: "This is user GET only",
        firstName: "Garv",
        netWorth: "1.2 Trillion dollars"
    });
});

app.post("/user" , (req,res) => {
    console.log("Save data");
    res.send("Data saved")
})

app.delete("/user" , (req,res) => {
    res.send("User deleted")
})

// this matches both get and post requests
app.use( "/test" ,(req,res) => {
    res.send("This func is called as request handler")
} )

const port = 7777
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

console.log("This is app");
