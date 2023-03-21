import express from 'express'
import Pengaduan from '../controllers/Pengaduan.js'
import onlyUser from '../middlewares/onlyUser.js'
import onlyAdmin from '../middlewares/onlyAdmin.js'

const pengaduan = express.Router()

pengaduan.get("/",onlyAdmin,Pengaduan.getAll)
pengaduan.post("/",onlyUser,Pengaduan.post)
pengaduan.get("/process",onlyAdmin,Pengaduan.process)
pengaduan.get("/selesai",onlyAdmin,Pengaduan.selesai)
pengaduan.get("/:id",onlyAdmin,Pengaduan.getSingle)
pengaduan.patch("/process/:id",onlyAdmin,Pengaduan.patch)

export default pengaduan