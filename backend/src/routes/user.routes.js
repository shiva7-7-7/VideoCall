import { Router } from "express";
import { acceptFriendReq, getFriendRequest, getMyFriends, getRecommendedUsers, outgoingFriendReq, sendRequest } from "../controller/user.controller.js";
import auth from "../middlewares/Authorization.js";

const userRoutes=Router();
userRoutes.use(auth)
userRoutes.get('/',getRecommendedUsers)
userRoutes.get('/friends',getMyFriends)

userRoutes.post('/friend-request/:id',sendRequest)
userRoutes.put('/friend-request/:id/accept',acceptFriendReq);

userRoutes.get('/friend-requests',getFriendRequest)
userRoutes.get('/outgoing-friend-requests',outgoingFriendReq)

export default userRoutes;
