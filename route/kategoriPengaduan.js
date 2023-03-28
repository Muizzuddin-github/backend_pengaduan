import express from 'express'
import KategoriPengaduan from '../controllers/KategoriPengaduan.js'
import onlyAdmin from '../middlewares/OnlyAdmin.js'
import onlyLogin from '../middlewares/onlyLogin.js'

const kategoriPengaduan = express.Router()


kategoriPengaduan.get("/",onlyLogin,KategoriPengaduan.get)
kategoriPengaduan.post("/",onlyAdmin,KategoriPengaduan.post)


export default kategoriPengaduan