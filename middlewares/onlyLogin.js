import verify from "../func/verify.js"
import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const onlyLogin = async (req,res,next) => {
    try{

        const refreshToken = req.cookies.refresh_token

        const check = await verify(refreshToken,process.env.REFRESH_KEY)
        if(!check){
            throw new Error("silahkan login terlebih dahulu")
        }
        
        const user = await prisma.user.findMany({
            where : {
                refresh_token : refreshToken
            }
        })
        
        if(!user.length){
            throw new Error("silahkan login terlebih dahulu")
        }

        const accessToken = req.headers.authorization

        const decoded = jwt.verify(accessToken,process.env.ACCESS_KEY)

        const userAccess = await prisma.user.findMany({
            where : {
                user : decoded.id
            }
        })

        if(!userAccess.length){
            throw new Error("access token dibutuhkan")
        }

        next()

    }catch(err){
        return res.status(401).json({
            status : "Unauthorized",
            message : "terjadi kesalahan diclient",
            errors : [err.message],
            data : []
        })
    }
}

export default onlyLogin