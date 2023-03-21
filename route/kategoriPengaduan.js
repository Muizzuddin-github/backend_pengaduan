import express from 'express'
import KategoriPengaduan from '../controllers/KategoriPengaduan.js'
import onlyAdmin from '../middlewares/onlyAdmin.js'

const kategoriPengaduan = express.Router()


kategoriPengaduan.get("/",KategoriPengaduan.get)
kategoriPengaduan.post("/",onlyAdmin,KategoriPengaduan.post)


export default kategoriPengaduan