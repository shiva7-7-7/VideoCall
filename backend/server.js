import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import userRouter from './src/routes/user.routes.js';

dotenv.config();
const PORT=process.env.PORT;
const app=express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth',userRouter);

app.listen(PORT,()=>{
    console.log(`app is listening on Port ${PORT}`);
})

