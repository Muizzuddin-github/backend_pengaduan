import express from 'express'
import KategoriPengaduan from '../controllers/KategoriPengaduan.js'
import onlyAdmin from '../middlewares/OnlyAdmin.js'

const kategoriPengaduan = express.Router()


kategoriPengaduan.get("/",KategoriPengaduan.get)
kategoriPengaduan.post("/",onlyAdmin,KategoriPengaduan.post)
kategoriPengaduan.get("/gambar/:img",KategoriPengaduan.imgGet)


export default kategoriPengaduan