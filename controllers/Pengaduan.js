import { PrismaClient } from "@prisma/client"
import imgParser from "../func/imgParser.js"
import fs from 'fs'
import PengaduanVal from "../validation/PengaduanVal.js"
import ImgVal from "../validation/imgVal.js"
import moveUploadedFile from "../func/moveUploadedFile.js"
const prisma = new PrismaClient()

class Pengaduan{
    static async getAll(req,res){
        try{
            const pengaduan = await prisma.pengaduan.findMany({
                include : {
                    user : true
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
}


export default Pengaduan