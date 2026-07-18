const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User", // reference to users collection
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User", // reference to users collection
        required : true
    },
    status : {
        type : String,
        enum : {
            values : ["accepted","rejected","interested","ignored"],
            message : "{VALUE} is not a valid status"
        }
    }

},{timestamps:true})

// connectionRequestSchema.index({fromUserId : 1 , toUserId : 1})
connectionRequestSchema.index(
    { fromUserId: 1, toUserId: 1 },
    { unique: true }
); // to avoid multiple same fromUserId to toUserId connections

connectionRequestSchema.index(
    {toUserId: 1 }
);

// connectionRequestSchema.pre("save", function(next) {
//     const connection = this;
//     const fromUserId = connection.fromUserId
//     const toUserId = connection.toUserId
//     if (fromUserId.equals(toUserId)) {
//         throw new Error("You cannot send a connection request to yourself");
//     }
//     next(); //next tells Mongoose to continue with the save.
// })

connectionRequestSchema.pre("save", function() {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("You cannot send a connection request to yourself");
    }
});
const connectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema)

module.exports = connectionRequestModel