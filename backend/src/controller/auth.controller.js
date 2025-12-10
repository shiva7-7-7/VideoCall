import UserModel from "../model/user.model.js";
import jwtAuth from 'jsonwebtoken'
import dotenv from 'dotenv'
import profilePics from "../assets/profilePic.js";
import { upsertUser } from "../lib/stream.js";
dotenv.config();
export async function register(req,res){
   try {
    const {fullName, email, password}=req.body;
    if(!fullName || !email || !password){
        return res.status(400).send("insufficient input");
    }
    // regx for email valid
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!regex.test(email)){
        return res.status(400).send("Invalid email address");
    }
    // password check
    if(password?.length<6){
        return res.status(400).send("invalid password");
    }
    // if email already exist
    const result=await UserModel.findOne({email});
    if(result){
        return res.status(400).send("email already exists")
    }
    // create new user
    const profilePic=profilePics[Math.floor(Math.random()*profilePics.length)];
    console.log(profilePic)
    const newUser=UserModel({fullName,email,password,profilePic});
    await newUser.save();
    // creating user on stream platform
    await upsertUser({id:newUser._id, name:newUser.fullName, profilePic});
    return res.status(201).send(newUser);
   } catch (error) {
    console.log("error in register controller");
    return res.status(500).send(error);
   }
}

// login
export async function login(req,res){
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("insufficient input");
        }
        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(400).send("invalid username or password");
        }
        console.log("Hiiii");
        const result=await user.passwordCheck(password);
        if(!result){
            return res.status(400).send("invalid username or password");
        }
        const token=jwtAuth.sign({ id: user._id, email: user.email },process.env.JWT_SECRET,{expiresIn:7*24*60*60*1000})
        res.cookie("authToken",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
        return res.status(200).send(user)
    } catch (error) {
        console.log("error in login controller");
        return res.status(500).send(error);
    }
}

// logout
export async function logout(req,res){
    try {
        res.clearCookie("authToken")
        return res.status(200).send("Logout successfull");
    } catch (error) {
        console.log("error in logOut controller");
        return res.status(500).send(error);
    }
}

export async function onBoarding(req,res,next){
        try {
            const {bio,nativeLanguage,learningLanguage,location}=req.body;
            if(!bio || !nativeLanguage || !learningLanguage || !location){
                return res.status(400).send("All fields required");
            }
            const id=req.user.id;
            const user=await UserModel.findOneAndUpdate({_id:id},
                                              {bio,nativeLanguage,learningLanguage,location,isOnboarded:true},
                                              {new:true}).select("-password");
            if(!user){
                return res.status(400).send("user not found");
            }
            return res.status(201).send(user);
        } catch (error) {
            console.log("error in onboard controller");
            return res.status(500).send(error);
        }
}