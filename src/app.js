const express = require("express")

const connectDB = require("./config/database") // connect to database
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


const app = express();
    
 // SCHEMA INCLUDES ALL THE STUFF WE GONNA ADD TO USER COLLECTION

const port = 7777


console.log("This is app");
