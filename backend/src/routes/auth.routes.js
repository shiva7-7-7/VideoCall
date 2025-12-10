import { Router } from "express";
import { login, logout, onBoarding, register } from "../controller/auth.controller.js";
import auth from "../middlewares/Authorization.js";

const authRouter=Router();
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/onboard',auth,onBoarding);

authRouter.get("/me",auth,(req,res)=>{
    return res.status(200).send(req.user);
})


export default authRouter;