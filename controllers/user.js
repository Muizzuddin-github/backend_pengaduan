import { PrismaClient } from "@prisma/client"
import UserVal from "../validation/UserVal.js"
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

class User{
    static async get(req,res){
        try{

            const user = await prisma.users.findMany({
                select : {
                    id : true,
                    username : true,
                    email: true,
                    tanggal_daftar: true,
                    roles : {
                        select : {
                            role : true
                        }
                    }
                }
            })
            return res.status(200).json({
                status : "OK",
                message : "semua data user",
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

    static async post(req,res){
        try{

            const checkContentType = req.is('application/json')
            if(!checkContentType){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["content type harus application/json"],
                    data : []
                })
            }

            const val = new UserVal(req.body)
            val.checkType()

            if(val.getErrors().length){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : val.getErrors(),
                    data : []
                })
            }
            
            val.checkLen()
            val.checkIsEmail()
            await val.checkUniqEmail()
            
            if(val.getErrors().length){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : val.getErrors(),
                    data : []
                })
            }

            const salt = bcryptjs.genSaltSync(10)
            const hashPassword = bcryptjs.hashSync(val.password,salt)

            const user = await prisma.users.create({
                data : {
                    username : val.username,
                    email : val.email,
                    password : hashPassword
                },
                select : {
                    id : true,
                    username : true,
                    email : true,
                    tanggal_daftar : true
                }
            })
            
            return res.status(201).json({
                status : "Created",
                message : "berhasil menambahkan user",
                errors : [],
                data : [user]
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

export default User