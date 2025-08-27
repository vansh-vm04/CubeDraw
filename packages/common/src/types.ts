import {email, z} from "zod"

export const CreateUserSchema = z.object({
    username:z.string().min(4).max(20),
    email: z.email(),
    password:z.string().min(8).max(20)
})
export const SignInSchema = z.object({
    email:z.email(),
    password:z.string().min(8).max(20)
})
export const CreateRoomSchema = z.object({
    roomName:z.string().min(4).max(20)
})