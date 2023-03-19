import { PrismaClient } from "@prisma/client"
import KategoriPengaduanVal from "../validation/KategoriPengaduanVal.js"
import imgParser from "../func/imgParser.js"
import fs from 'fs'
import moveUploadedFile from "../func/moveUploadedFile.js"
import path from "path"
import { fileURLToPath } from "url"
import imgVal from "../validation/imgVal.js"

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
            const urlFileUpload = parse.files.gambar.filepath

            const val = new KategoriPengaduanVal(parse.field)
            val.checkType()

            if(val.getErrors().length){
                fs.unlinkSync(urlFileUpload)
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
                fs.unlinkSync(urlFileUpload)
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : val.getErrors(),
                    data : []
                })
            }

            const checkImg = new imgVal(parse.files.gambar)
            checkImg.checkSize()
            checkImg.checkIsImg()

            if(checkImg.getErrors().length){
                fs.unlinkSync(urlFileUpload)
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : checkImg.getErrors(),
                    data : []
                })
            }


            const gambar = moveUploadedFile(parse.files.gambar)
            const imgUrl = `${req.protocol}://${req.headers.host}/kategori-pengaduan/gambar/${gambar}`

            const kat = await prisma.kategori_pengaduan.create({
                data : {
                    nama : val.nama,
                    foto : imgUrl,
                    deskripsi : val.deskripsi
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

    static imgGet(req,res){
        try{
            const imgName = req.params.img
            const __filename = fileURLToPath(import.meta.url)
            const __dirname = path.dirname(__filename)
            const __dirname2 = path.dirname(__dirname)
    
            const img = `/images/${imgName}`

            const checkImg = fs.existsSync(`.${img}`)
            if(!checkImg){
                throw new Error("file tidak ditemukan")
            }

            return res.sendFile(img,{root : `${__dirname2}`})
        }catch(err){
            return res.status(400).json({
                status : "Bad Request",
                message : "terjadi kesalahan diclient",
                errors : [err.message],
                data : []
            })
        }
    }
}


export default KategoriPengaduan