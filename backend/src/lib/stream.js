import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const apiKey=process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;

const streamClient=new StreamChat(apiKey,apiSecret,{
    disableCache:true
})


export async function upsertUser(userData){
    try {
        await streamClient.upsertUser(userData);
        return true;
    } catch (error) {
        console.log("error in upsertUser");
        return false;
    }
}