import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


const connectDB = async (req,res,next) => {
    try{

        await prisma.$queryRaw`SELECT 1`
        next()
    }catch(err){
        return res.status(500).json({
            status : "Internal Server Error",
            message : "terjadi kesalahan diserver",
            errors : ["koneksi database gagal"],
            data : []
        })
    }
}

export default connectDB