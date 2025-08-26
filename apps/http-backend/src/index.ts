import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware.js";
import {CreateUserSchema, SignInSchema, CreateRoomSchema} from "@repo/common/types"
const port = 5000;

const app = express();
app.use(express.json());


app.post('/api/v1/signup',async (req,res)=>{
    const data = req.body;
    try {
        const isValid = CreateUserSchema.safeParse(data);
        if(!isValid.success){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        //db logic here
        const userId = 1;
        const token = jwt.sign({userId},JWT_SECRET);
        res.status(200).json({message:"Signup successful",token:token});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
})
app.post('/api/v1/signin',async (req,res)=>{
    const data = req.body;
    try {
        const isValid = SignInSchema.safeParse(data);
        if(!isValid.success){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        //db logic here
        const userId =1;
        const token = jwt.sign({userId},JWT_SECRET);
        res.status(200).json({message:"Signin successful",token:token});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
})

app.post('api/v1/room',authMiddleware,async (req,res)=>{
    
})

app.listen(port,()=>{
    console.log("HTTP server is connected")
})