import { Router } from "express";
import { getMyFriends, getRecommendedUsers, sendRequest } from "../controller/user.controller.js";
import auth from "../middlewares/Authorization.js";

const userRoutes=Router();
userRoutes.use(auth)
userRoutes.get('/',getRecommendedUsers)
userRoutes.get('/friends',getMyFriends)
userRoutes.post('/request/:id',sendRequest)

export default userRoutes;
