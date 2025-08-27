import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware.js";
import {CreateUserSchema, SignInSchema, CreateRoomSchema} from "@repo/common/types";
import {prisma} from "@repo/db/client";
import bcrypt from "bcrypt"
import { passwordVerify } from "./utils/passwordVerify.js";

const port = 5000;

const app = express();
app.use(express.json());


app.post('/api/v1/signup',async (req,res)=>{
    const data = req.body;
    const parsedData = CreateUserSchema.safeParse(data);
        if(!parsedData.success){
            return res.status(401).json({message:"Invalid Credentials"});
        }
    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password,10);
        const user = await prisma.user.create({
            data:{
                username:parsedData.data.username,
                email:parsedData.data.email,
                password: hashedPassword
            }
        })
        const userId = user.id;
        const token = jwt.sign({userId},JWT_SECRET);
        res.status(200).json({message:"Signup successful",token:token});
    } catch (error) {
        res.status(411).json({message:"User with same email or name already exists"});
        console.log(error);
    }
})
app.post('/api/v1/signin',async (req,res)=>{
    const data = req.body;
    const parsedData = SignInSchema.safeParse(data);
        if(!parsedData.success){
            return res.status(401).json({message:"Invalid Credentials"});
        }
    try {
        const user = await prisma.user.findFirst({where:{email:parsedData.data.email}});
        if(!user) return res.status(404).json({message:"User does not exist"});
        const isPassValid = await passwordVerify(parsedData.data.password,user.password);
        if(!isPassValid) return res.status(401).json({message:"Wrong password"})
        const userId = user.id;
        const token = jwt.sign({userId},JWT_SECRET);
        res.status(200).json({message:"Signin successful",token:token});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
})

app.post('/api/v1/room',authMiddleware,async (req,res)=>{
    const data = req.body;
    const parsedData = CreateRoomSchema.safeParse(data);
    if(!parsedData.success){
        return res.status(401).json({message:"Invalid crendentials"});
    }
    try {
        await prisma.room.create({
            data:{
                roomName:parsedData.data.roomName,
                adminId:req.userId
            }
        })
        res.status(200).json({message:"Room created"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
})

app.listen(port,()=>{
    console.log("HTTP server is connected")
})