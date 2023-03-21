import express from 'express'
import KategoriPengaduan from '../controllers/KategoriPengaduan.js'
import onlyAdmin from '../middlewares/OnlyAdmin.js'

const kategoriPengaduan = express.Router()


kategoriPengaduan.get("/",KategoriPengaduan.get)
kategoriPengaduan.post("/",onlyAdmin,KategoriPengaduan.post)
// kategoriPengaduan.delete("/",onlyAdmin,KategoriPengaduan.del)


export default kategoriPengaduan