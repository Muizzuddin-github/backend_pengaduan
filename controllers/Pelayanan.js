import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

class Pelayanan{
    static async get(req,res){
        try{
            const kritik = await prisma.pelayanan.findMany()
            return res.status(200).json({
                status : "OK",
                message : "Data kritik dari user",
                errors : [],
                data : kritik
            })
        }catch(err){
            res.status(500).json({
                status : "Internal Server Error",
                message : "terjadi kesalahan diserver",
                errors : [err.message],
                data : []
            })
        }
    }
}

export default Pelayanan