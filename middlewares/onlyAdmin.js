import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import verify from "../func/verify.js"



const onlyAdmin = async (req,res,next) => {
    try{

        const refreshToken = req.cookies.refresh_token

        const checkRefreshToken = await verify(refreshToken,process.env.REFRESH_KEY)

        if(!checkRefreshToken){
            return res.status(401).json({
                status : "Unauthorized",
                message : "terjadi kesalahan diclient",
                errors : ["silahkan login terlebih dahulu"]
            })
        }

        const user = await prisma.user.findMany({
            where : {
                refresh_token : refreshToken
            }
        })

        if(!user.length){
            return res.status(401).json({
                status : "Unauthorized",
                message : "terjadi kesalahan diclient",
                errors : ["silahkan login terlebih dahulu"]
            })
        }

        if(user[0].status != "admin"){
            throw new Error("hanya boleh admin yang bisa access")
        }


        const checkAccessToken = req.headers.authorization
        if(!checkAccessToken){
            throw new Error("silahkan kirimkan access token")
        }

        const [schema,token] = checkAccessToken.split(" ")
        if(schema != "Bearer"){
            throw new Error("schema authorization salah")
        }
        
        jwt.verify(token,process.env.ACCESS_KEY)

        next()

    }catch(err){
        return res.status(403).json({
            status : "Forbidden",
            message : "terjadi kesalahan diclient",
            errors : [err.message],
            data : []
        })
    }
}


export default onlyAdmin