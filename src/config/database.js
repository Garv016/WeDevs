const mongoose = require("mongoose");
const { setServers } = require("node:dns/promises");

setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async() =>{
    await mongoose.connect(
        "mongodb+srv://first:PdjFm3DimvJHDK@cluster0.sw2wzxp.mongodb.net/"
    );
};

module.exports = connectDB;




