import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const UserSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    bio:{
        type:String,
        default:""
    },
    profilePic:{
        type:String,
        default:""
    },
    nativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    isOnboarded:{
        type:Boolean,
        default:false
    },
    friends:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
        }
    ]
},{timestamps:true})

UserSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        return next();
    }
    try {
        const salt=await bcrypt.genSalt(8);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        console.log("error in hashing")
        next(error);
    }
})

UserSchema.method({
    passwordCheck: async function(givenpass){
        try{
            const result=await bcrypt.compare(givenpass,this.password);
            return result;
        }catch(error){
            console.log("error in password comapre")
            next(error);
        }
    }
});

const UserModel=mongoose.model("User",UserSchema);
export default UserModel;