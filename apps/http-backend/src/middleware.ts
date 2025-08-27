import jwt, { JwtPayload } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";

export const authMiddleware = async (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers["authorization"] ?? "";
    try {
        const decoded:JwtPayload = jwt.verify(token,JWT_SECRET) as JwtPayload;
        if(!decoded.userId || typeof decoded.userId != "string") return res.status(404).json({message:"Unauthorized user"});
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({message:"Unauthorized user"});
    }
}