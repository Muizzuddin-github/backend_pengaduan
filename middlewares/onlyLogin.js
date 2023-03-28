import verify from "../func/verify.js"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const onlyLogin = async (req,res,next) => {
    try{

        const refreshToken = req.cookies.refresh_token

        const check = await verify(refreshToken,process.env.REFRESH_KEY)
        if(!check){
            throw new Error("silahkan login terlebih dahulu")
        }
        
        const user = await prisma.users.findMany({
            where : {
                refresh_token : refreshToken
            }
        })
        
        if(!user.length){
            throw new Error("silahkan login terlebih dahulu")
        }

        req.userID = user[0].id

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