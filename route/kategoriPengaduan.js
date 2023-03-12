import express from 'express'
import KategoriPengaduan from '../controllers/KategoriPengaduan.js'

const kategoriPengaduan = express.Router()


kategoriPengaduan.get("/",KategoriPengaduan.get)
kategoriPengaduan.post("/",KategoriPengaduan.post)


export default kategoriPengaduan