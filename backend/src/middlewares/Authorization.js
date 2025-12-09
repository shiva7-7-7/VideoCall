import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export default function auth(req,res,next){
    try {
        const token=res.cookies?.authToken;
        if(!token){
            res.status(400).send("Not authorized");
        }
        const user=jwt.verify(token,process.env.JWT_SECRET)
        req.user=user;
        next();
    } catch (error) {
        console.log("error in auth decoder")
        res.status(500).send(error);
    }
}