import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import verify from "../func/verify.js"

const onlyUser = async (req,res,next) => {
    try{
        const refreshToken = req.cookies.refresh_token

        const check = await verify(refreshToken,process.env.REFRESH_KEY)

        if(!check){
            return res.status(401).json({
                status : "Unauthorized",
                message : "terjadi kesalahan diclient",
                errors : ["silahkan login terlebih dahulu"],
                data : []
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
                errors : ["silahkan login terlebih dahulu"],
                data : []
            })
        }

        if(user[0].status !=="user"){
            throw new Error("hanya user yang bisa access")
        }
        
        const checkAccessToken = req.headers.authorization
        if(!checkAccessToken){
            throw new Error("silahkan kirimkan access token")
        }

        const [schema,token] = checkAccessToken.split(" ")
        if(schema != "Bearer"){
            throw new Error("schema authorization salah")
        }
        
        const decoded = jwt.verify(token,process.env.ACCESS_KEY)

        const userAccess = await prisma.user.findMany({
            where : {
                id : decoded.id
            }
        })

        if(!userAccess.length){
            throw new Error("access token ditolak user tidak ada")
        }

        if(userAccess[0].status !== "user"){
            throw new Error("access token hanya boleh user")
        }

        req.userID = user[0].id

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

export default onlyUser