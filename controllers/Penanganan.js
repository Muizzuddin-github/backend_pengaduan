import { PrismaClient } from "@prisma/client"
import fs from 'fs'
import imgParser from "../func/imgParser.js"
import ImgVal from "../validation/imgVal.js"
import moveUploadedFile from "../func/moveUploadedFile.js"
import PenangananVal from "../validation/PenangananVal.js"

const prisma = new PrismaClient()

class Penanganan{
    static async getAll(req,res){
        try{
            const dataPenanganan = await prisma.penanganan.findMany({
                select : {
                    id : true,
                    foto_bukti : true,
                    deskripsi : true,
                    tanggal : true,
                    pengaduan : {
                        select : {
                            user : {
                                select : {
                                    id : true,
                                    username : true,
                                    email : true
                                }
                            }
                        }
                    }
                }
            })

            return res.status(200).json({
                status : "OK",
                message : "semua data pengaduan",
                errors : [],
                data : dataPenanganan
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

            const checkFolder = fs.existsSync("./images")
            if(!checkFolder){
                fs.mkdirSync("./images")
            }

            const checkContentType = req.is('multipart/form-data')
            if(!checkContentType){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["content type harus multipart/form-data"],
                    data : []
                })
            }

            const data = await imgParser(req)
            const ubah = JSON.stringify(data)
            const parse = JSON.parse(ubah)

            if(typeof parse.files.foto_bukti === "undefined"){
                const keyUp = Object.keys(parse.files)[0]
                fs.unlinkSync(parse.files[keyUp].filepath)
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["butuh properti foto_bukti"],
                    data : []
                })
            }

            const checkPengaduan = await prisma.pengaduan.findMany({
                where : {
                    id : +req.params.id
                }
            })

            if(!checkPengaduan.length){
                fs.unlinkSync(parse.files.foto_bukti.filepath)
                return res.status(404).json({
                    status : "Not Found",
                    message : "terjadi kesalahan diclient",
                    errors : ["pengaduan tidak ditemukan"],
                    data : []
                })
            }

            const checkPenanganan = await prisma.penanganan.findMany({
                where : {
                    fk_pengaduan : +req.params.id
                }
            })

            if(checkPenanganan.length){
                fs.unlinkSync(parse.files.foto_bukti.filepath)
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["pengaduan sudah ditangani"],
                    data : []
                })
            }

            const checkImg = new ImgVal(parse.files.foto_bukti)
            checkImg.checkSize()
            checkImg.checkIsImg()

            if(checkImg.getErrors().length){
                fs.unlinkSync(parse.files.foto_bukti.filepath)
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : checkImg.getErrors(),
                    data : []
                })
            }

            const img = moveUploadedFile(parse.files.foto_bukti)
            const imgUrl = `${req.protocol}://${req.headers.host}/gambar/${img}`

            const checkDataPengaduan = new PenangananVal(parse.field)
            checkDataPengaduan.checkType()

            if(checkDataPengaduan.getErrors().length){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : checkDataPengaduan.getErrors(),
                    data : []
                })
            }

            checkDataPengaduan.checkLen()
            
            if(checkDataPengaduan.getErrors().length){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : checkDataPengaduan.getErrors(),
                    data : []
                })
            }
            
            const penangananInsert = await prisma.penanganan.create({
                data : {
                    foto_bukti : imgUrl,
                    deskripsi : checkDataPengaduan.deskripsi,
                    fk_pengaduan : +req.params.id
                }
            })

            await prisma.pengaduan.update({
                where : {
                    id : +req.params.id
                },
                data : {
                    status : "selesai"
                }
            })


            return res.status(201).json({
                status : "Created",
                message : "pengaduan berhasil ditangani",
                errors : [],
                data : [penangananInsert]
            })
        }catch(err){
            return res.status(200).json({
                status : "Internal Server Error",
                message : "terjadi kesalahan diserver",
                errors : [err.message],
                data : []
            })
        }
    }
}

export default Penanganan