import jwt  from "jsonwebtoken"
import { decode } from "punycode"

export function verifyToken(token:string){
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET!)
        if(!decode){
            console.log("Failed to Decode")
        }
        return decode
    } catch (error) {
        console.error("Failed to decode", error)
    }
}