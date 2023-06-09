import { PrismaClient } from "@prisma/client"
import imgParser from "../func/imgParser.js"
import fs from 'fs'
import PengaduanVal from "../validation/PengaduanVal.js"
import ImgVal from "../validation/imgVal.js"
import moveUploadedFile from "../func/moveUploadedFile.js"
import getDirName from "../func/getDirName.js"
const prisma = new PrismaClient()

class Pengaduan{
    static async getAll(req,res){
        try{
            const pengaduan = await prisma.pengaduan.findMany({
                where : {
                    status : "terkirim"
                },
                select : {
                    id : true,
                    foto : true,
                    lokasi : true,
                    deskripsi : true,
                    status : true,
                    tanggal : true,
                    users : {
                        select : {
                            id : true,
                            username : true,
                            email : true
                        }
                    }
                }
            })

            return res.status(200).json({
                status : "OK",
                message : "semua data pengaduan",
                errors : [],
                data : pengaduan
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

    static async getSingle(req,res){
        try{

            const pengaduan = await prisma.pengaduan.findMany({
                where : {
                    id : +req.params.id
                },
                select : {
                    id : true,
                    foto : true,
                    lokasi : true,
                    deskripsi : true,
                    status : true,
                    tanggal : true,
                    kategori_pengaduan : {
                        select : {
                            nama : true
                        }
                    },
                    users : {
                        select : {
                            username : true,
                            email : true
                        }
                    }
                }
            })

            if(!pengaduan.length){
                return res.status(404).json({
                    status : "Not Found",
                    message : "terjadi kesalahan diclient",
                    errors : ["pengaduan tidak ditemukan"],
                    data : []
                })
            }


            return res.status(200).json({
                status : "OK",
                message : "data pengaduan",
                errors : [],
                data :  pengaduan
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

            if(typeof parse.files.foto === "undefined"){
                const keyUp = Object.keys(parse.files)[0]
                fs.unlinkSync(parse.files[keyUp].filepath)
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["harus mengupload foto dengan properti foto"],
                    data : []
                })
            }

            const checkPengaduan = new PengaduanVal(parse.field)
            checkPengaduan.checkType()
            checkPengaduan.checkLen()

            if(checkPengaduan.getErrors().length){
                fs.unlinkSync(parse.files.foto.filepath)
                return res.status(404).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : checkPengaduan.getErrors(),
                    data : []
                })
            }

            await checkPengaduan.checkKategori()

            if(checkPengaduan.getErrors().length){
                fs.unlinkSync(parse.files.foto.filepath)
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : checkPengaduan.getErrors(),
                    data : []
                })
            }

            const checkImg = new ImgVal(parse.files.foto)
            checkImg.checkSize()
            checkImg.checkIsImg()

            if(checkImg.getErrors().length){
                fs.unlinkSync(parse.files.foto.filepath)
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : checkImg.getErrors(),
                    data : []
                })
            }

            const img = moveUploadedFile(parse.files.foto)
            const imgUrl = `${req.protocol}://${req.headers.host}/gambar/${img}`

            const pengaduanInsert = await prisma.pengaduan.create({
                data : {
                    foto : imgUrl,
                    lokasi : checkPengaduan.lokasi,
                    deskripsi : checkPengaduan.deskripsi,
                    fk_kategori_pengaduan : +checkPengaduan.kategoriPengaduan,
                    fk_user : req.userID
                }
            })

            return res.status(201).json({
                status : "Created",
                message : "berhasil menambah pengaduan",
                errors : [],
                data : [pengaduanInsert]
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

    static async status(req,res){
        try{

            const statusVal = ["terkirim","ditolak","diproses","selesai"]

            if(!statusVal.includes(req.params.status)){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["status pengaduan tidak tersedia"],
                    data : []
                })
            }

            const pengaduan = await prisma.pengaduan.findMany({
                where : {
                    status : req.params.status
                },
                select : {
                    id : true,
                    foto : true,
                    lokasi : true,
                    deskripsi : true,
                    status : true,
                    tanggal : true,
                    users : {
                        select : {
                            id : true,
                            username : true,
                            email : true
                        }
                    }
                }
            })

            return res.status(200).json({
                status : "OK",
                message : "semua data pengaduan",
                errors : [],
                data : pengaduan
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


    static async patch (req,res){
        try{
            const checkPengaduan = await prisma.pengaduan.findMany({
                where : {
                    id : +req.params.id
                }
            })

            if(!checkPengaduan.length){
                return res.status(404).json({
                    status : "Not Found",
                    message : "terjadi kesalahan diclient",
                    errors : ["pengaduan tidak ditemukan"],
                    data : []
                })
            }

            if(checkPengaduan[0].status !== "terkirim"){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["pengaduan selain terkirim tidak bisa diproses"],
                    data : []
                })
            }

            const pengaduan = await prisma.pengaduan.update({
                where : {
                    id : +req.params.id
                },
                data : {
                    status : "diproses"
                }
            })


            return res.status(200).json({
                status : "OK",
                message : "berhasil memproses pengaduan",
                errors : [],
                data : [pengaduan]
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

    static async del(req,res){
        try{

            const pengaduan = await prisma.pengaduan.findMany({
                where : {
                    id : +req.params.id
                }
            })

            if(!pengaduan.length){
                return res.status(404).json({
                    status : "Not Found",
                    message : "terjadi kesalahan diclient",
                    errors : ["pengaduan tidak ditemukan"],
                    data : []
                })
            }

            if(pengaduan[0].status !== "terkirim"){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["status selain terkirim pengaduan tidak bisa dihapus"],
                    data : []
                })
            }

            const imgUrl = pengaduan[0].foto.split("/")
            const img = imgUrl[imgUrl.length - 1]
            const dirName = getDirName()
            
            fs.unlinkSync(`${dirName}/images/${img}`)

            await prisma.pengaduan.delete({
                where : {
                    id : +req.params.id
                }
            })

            return res.status(200).json({
                status : "OK",
                message : "berhasil dihapus",
                errors : [],
                data : []
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

    static async user(req,res){
        try{

            const statusVal = ["terkirim","ditolak","diproses","selesai"]

            if(!statusVal.includes(req.params.status)){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["status pengaduan tidak tersedia"],
                    data : []
                })
            }

            const pengaduan = await prisma.pengaduan.findMany({
                where : {
                    status : req.params.status,
                    fk_user : req.userID
                },
                select : {
                    id : true,
                    foto : true,
                    lokasi : true,
                    deskripsi : true,
                    status : true,
                    tanggal : true,
                    users : {
                        select : {
                            id : true,
                            username: true,
                            email : true
                        }
                    }
                }
            })

            return res.status(200).json({
                status : "OK",
                message : "semua data pengaduan",
                errors : [],
                data : pengaduan
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


export default Pengaduan