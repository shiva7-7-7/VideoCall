import { Router } from "express";
import auth from "../middlewares/Authorization.js";
import { getStreamToken } from "../controller/chat.controller.js";

const chatRoutes=Router();

chatRoutes.use(auth);

chatRoutes.get('/token',getStreamToken);

export default chatRoutes;