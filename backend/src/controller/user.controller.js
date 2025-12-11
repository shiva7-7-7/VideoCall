import friendReqModel from "../model/friendRequest.model.js";
import UserModel from "../model/user.model.js";
async function getRecommendedUsers(req,res){
    try {
        const currentUserId=req.user.id;
        const user=await UserModel.findById(currentUserId);
        if(!user){
            return res.status(400).send("invalid user");
        }
        const users=await UserModel.find({$and:[
            {_id: { 
                $ne: currentUserId,              // exclude yourself
                $nin: user.friends               // also exclude friends
            }},
            {isOnboarded:true}
        ]});
        // if(users?.length===0){
        //     return res.status(400).send("no reco")
        // }
        return res.status(200).send(users); 
    } catch (error) {
        console.log("error in getRecommendedUsers controller");
        return res.status(500).send(error?.message);
    }
}

async function getMyFriends(req,res){
    try {
        const currentUserId=req.user.id;
        const user=await UserModel.findOne({
            _id:currentUserId
        }).populate("friends","_id fullName nativeLanguage location email");
        return res.status(200).send(user.friends);
    } catch (error) {
        console.log("error in getMyFriends controller");
        return res.status(500).send(error?.message);
    }
}

async function sendRequest(req, res) {
    try {
        const myId = req.user.id; // or req.user._id depending on JWT
        const { id: receiverId } = req.params;

        // 1. Check receiver exists
        const receiverUser = await UserModel.findById(receiverId);
        if (!receiverUser) {
            return res.status(400).send("User not found");
        }

        // 2. Check if already friends
        const currUser = await UserModel.findById(myId);
        if (currUser.friends.map(f => f.toString()).includes(receiverUser._id.toString())) {
            return res.status(400).send("User is already a friend");
        }

        // 3. Check if friend request already exists
        const request = await friendReqModel.findOne({
            $or: [
                { sender: currUser._id, receiver: receiverUser._id },
                { sender: receiverUser._id, receiver: currUser._id }
            ]
        });

        if (request) {
            return res.status(400).send("Friend request already exists");
        }

        // 4. Create new request
        const newRequest = await friendReqModel.create({
            sender: currUser._id,
            receiver: receiverUser._id
        });

        return res.status(201).send(newRequest);

    } catch (error) {
        console.log("error in sendRequest:", error);
        return res.status(500).send(error.message);
    }
}

async function acceptFriendReq(req,res){
    try{
        const {id:requestId}=req.params;
        const myId=req.user.id;
        const request=await friendReqModel.findById(requestId);
        if(!request) return res.status(400).send("invalid friend request");
        if(request.reciever.toString()!==myId.toString()){
            return res.status(403).send("you are not valid user to accept request");
        }
        const currentUser=await UserModel.findById(request.reciever);
        if (currentUser.friends.some(f => f.toString() === request.sender.toString())) {
            return res.status(400).send("you are already a friend");
        }
        const senderUser=await UserModel.findById(request.sender);
        if(!senderUser) return res.status(400).send("sender not found");
        currentUser.friends.addToSet(senderUser._id);
        await currentUser.save()
        senderUser.friends.addToSet(currentUser._id);
        await senderUser.save();
        request.status="accepted";
        await request.save();
        return res.status(200).send(request);
    }catch(error){
        console.log("error in acceptFriendReq");
        return res.status(500).send(error.message);
    }
}

async function getFriendRequest(req,res) {
    try {
        const userId=req.params.id;
        const friendReq=await friendReqModel.find({reciever:userId,status:"pending"})
                        .populate("sender","_id fullName nativeLanguage learningLanguage");
        return res.status(200).send(friendReq);
    } catch (error) {
        console.log("error in getFriendRequest");
        return res.status(500).send(error.message);
    }    
}

async function outgoingFriendReq(req,res) {
    try {
        const userId=req.params.id;
        const friendReq=await friendReqModel.find({sender:userId,status:"pending"})
                        .populate("reciever","_id fullName nativeLanguage learningLanguage");
        return res.status(200).send(friendReq);
    } catch (error) {
        console.log("error in outgoingFriendReq");
        return res.status(500).send(error.message);
    }
}
export {getMyFriends,getRecommendedUsers,sendRequest,acceptFriendReq,getFriendRequest,outgoingFriendReq};