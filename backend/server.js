import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import authRouter from './src/routes/auth.routes.js';
import connect from './src/lib/mongoConnect.js';
import cookiesParser from 'cookie-parser';
import userRoutes from './src/routes/user.routes.js';
import chatRoutes from './src/routes/chat.routes.js';

dotenv.config();
const PORT=process.env.PORT;
const app=express();

app.use(cors());
app.use(express.json());
app.use(cookiesParser());

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/chat',chatRoutes);

app.listen(PORT,()=>{
    connect()
    console.log(`app is listening on Port ${PORT}`);
})


