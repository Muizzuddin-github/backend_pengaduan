import LoginVal from "../validation/LoginVal.js"
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class Auth{
    static async login(req,res){
        try{
            const user = new LoginVal(req.body)
            user.checkType()

            if(user.getErrors().length){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : user.getErrors(),
                    accessToken : "",
                    redirectURL : ""
                })
            }

            await user.checkEmailExits()

            if(user.getErrors().length){
                return res.status(404).json({
                    status : "Not Found",
                    message : "terjadi kesalahan diclient",
                    errors : user.getErrors(),
                    accessToken : "",
                    redirectURL : ""
                })
            }

            user.checkPassword()
            if(user.getErrors().length){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : user.getErrors(),
                    accessToken : "",
                    redirectURL : ""
                })
            }


            const refreshToken = jwt.sign({id : user.id}, process.env.REFRESH_KEY,{
                expiresIn : "1d"
            })

            const accessToken = jwt.sign({id : user.id},process.env.ACCESS_KEY,{
                expiresIn : "20m"
            })

            await prisma.users.update({
                where : {
                    id : user.id
                },
                data : {
                    refresh_token : refreshToken
                }
            })

            res.cookie("refresh_token",refreshToken,{
                httpOnly : true,
                maxAge : 60 * 60 * 24 * 1000,
                secure : false
            })

            let redirectURL = (user.status === "Admin") ? "/admin" : "/user"

            return res.status(200).json({
                status : "OK",
                message : "berhasil login",
                errors : [],
                accessToken : accessToken,
                redirectURL : redirectURL
            })

        }catch(err){
            return res.status(500).json({
                status : "Internal Server Error",
                message : "terjadi kesalahan diserver",
                errors : [err.message],
                accessToken : "",
                redirectURL : ""
            })
        }
    }

    static async logout(req,res){
        try{
            const refreshToken = req.cookies.refresh_token

            const user = await prisma.users.findMany({
                where : {
                    refresh_token : refreshToken
                }
            })

            if(!user.length){
                return res.status(401).json({
                    status : "Unauthorized",
                    message : "terjadi kesalahan diclient",
                    errors : ["silahkan login terlebih dahulu"],
                    accessToken : "",
                    redirectURL : ""
                })
            }

            await prisma.users.update({
                where : {
                    id : user[0].id
                },
                data : {
                    refresh_token : null
                }
            })

            res.clearCookie("refresh_token")

            return res.status(200).json({
                status : "OK",
                message : "berhasil logout",
                errors : [],
                accessToken : "",
                redirectURL : ""
            })
        }catch(err){
            return res.status(500).json({
                status : "Internal Server Error",
                message : "terjadi kesalahan diserver",
                errors : [err.message],
                accessToken : "",
                redirectURL : ""
            })
        }
    }


    static async refreshAccessToken(req,res){
        try{

            const accessToken = jwt.sign({id : req.userID},process.env.ACCESS_KEY,{
                expiresIn : "20m"
            })

            return res.status(200).json({
                status : "OK",
                message : "access token diberikan",
                errors : [],
                accessToken : accessToken
            })
        }catch(err){
            return res.status(500).json({
                status : "Internal Server Error",
                message : "terjadi kesalahan diserver",
                errors : [err.message],
                accessToken : ""
            })
        }
    }

    static async isLogin(req,res){
        try{

            const user = await prisma.users.findMany({
                where : {
                    id : +req.userID
                },
                select : {
                    id : true,
                    username : true,
                    email : true
                }
            })

            return res.status(200).json({
                status : "OK",
                message : "sudah login",
                errors : [],
                data : user
            })

        }catch(err){
            return res.status(500).json({
                status : "Internal Server Error",
                message : "terjadi kesalahan diserver",
                errors : [err.message],
                data : []
            })
        }
    }
}


export default Auth