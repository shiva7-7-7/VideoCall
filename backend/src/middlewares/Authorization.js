import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function auth(req, res, next) {
    try {
        const token = req.cookies?.authToken;  

        if (!token) {
            return res.status(401).send("Not authorized"); 
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // store user payload in request

        next();
    } catch (error) {
        console.log("Error in auth decoder:", error.message);

        return res.status(401).send("Invalid or expired token"); 
    }
}
