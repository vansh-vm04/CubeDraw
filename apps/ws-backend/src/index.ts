import {WebSocketServer} from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({port:8080});

wss.on('connection', (ws, req)=>{

    const url = req.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token');
    if(!token) return;
    const decoded = jwt.verify(token,JWT_SECRET);

    if(typeof decoded == 'string'){
        ws.close();
        return;
    }

    if(!decoded || !(decoded).userId){
        ws.close();
        return;
    }

    ws.on('message',(m)=>{
        ws.send("Hi")
    })
})