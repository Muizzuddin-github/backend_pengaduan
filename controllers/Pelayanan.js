import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

class Pelayanan{
        static async get(req,res){
            try{
                const kritik = await prisma.pelayanan.findMany({
                    include: {
                        user : {
                            select :{
                                id : true,
                                username : true,
                                email : true,
                            }
                        }
                    }
                })
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
        static async post(req,res){
            try{
                const isiKritik = req.body.kritik
                const isisaran = req.body.saran
                const fk_user = +req.body.fk_user
                const sendKritik = await prisma.pelayanan.create({
        
                    data : {
                        kritik : isiKritik,
                        saran : isisaran,
                        fk_user : fk_user
                    }
                })
                return res.status(200).json({
                    status : "OK",
                    message : "Berhasil menambahkan data kritik dari user",
                    errors : [],
                    data : sendKritik
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
    static async del(req,res){
        try{
            const idKritik = +req.params.id
            const cekKrisar = await prisma.pelayanan.findMany({
                where: {
                  id: idKritik
                }
              })
              
            // memeriksa kritik & saran ada atau tidak
              if(cekKrisar.length === 0){
                return res.status(404).json({
                    status : "Not Found",
                    message : "Terjadi kesalahan di user",
                    errors : ['Kritik & Saran sudah terhapus'],
                    data : []
                })
              }


            const hapusKrisar = await prisma.pelayanan.delete({
                where:{
                    id : idKritik 
                }
            })
            return res.status(200).json({
                status : "OK",
                message : "Kritik & Saran berhasil dihapus",
                errors : [],
                data : []
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