import {generateStreamToken} from '../lib/stream.js'

export async function getStreamToken(req,res){
    try {
        const token=generateStreamToken();
        return res.status(200).send(token);
    } catch (error) {
        console.log("error in getStreamToken")
        return res.status(500).send(error.message);
    }
}