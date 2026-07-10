const express = require("express")

const app = express();

app.use("/user/:userId/:name/:password", (req, res) => {
    console.log(req.params);
    console.log(req.query);
    
    res.send({
        message: "This is user GET only",
        firstName: "Garv",
        netWorth: "1.2 Trillion dollars"
    });
});
const port = 7777
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

console.log("This is app");
