import mongoose from "mongoose";

const FriendRequestSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["accepter","pending"],
        default:"pending"
    }
},{timestamps:true});

const friendReqModel=mongoose.model("friendRequest",FriendRequestSchema);

export default friendReqModel;