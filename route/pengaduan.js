import express from 'express'
import Pengaduan from '../controllers/Pengaduan.js'
import onlyUser from '../middlewares/onlyUser.js'

const pengaduan = express.Router()

pengaduan.get("/",Pengaduan.getAll)
pengaduan.post("/",onlyUser,Pengaduan.post)
pengaduan.get("/process",Pengaduan.process)
pengaduan.get("/selesai",Pengaduan.selesai)

export default pengaduan