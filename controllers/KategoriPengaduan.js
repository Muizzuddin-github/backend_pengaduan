import { PrismaClient } from "@prisma/client"
import KategoriPengaduanVal from "../validation/KategoriPengaduanVal.js"

const prisma = new PrismaClient()


class KategoriPengaduan {
    static async get(req,res){
        try{

            const kategori = await prisma.kategori_pengaduan.findMany()
            return res.status(200).json({
                status : "OK",
                message : "semua data kategori pengaduan",
                errors : [],
                data : kategori
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

            const val = new KategoriPengaduanVal(req.body)
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
            await val.uniqKategori()


            if(val.getErrors().length){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : val.getErrors(),
                    data : []
                })
            }

            const kat = await prisma.kategori_pengaduan.create({
                data : {
                    nama : val.nama
                }
            })

            return res.status(201).json({
                status : "Created",
                message : "berhasil menambahkan kategori pengaduan",
                errors : [],
                data : [kat]
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


export default KategoriPengaduan