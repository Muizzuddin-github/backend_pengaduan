import express from 'express'
import Pengaduan from '../controllers/Pengaduan.js'
import onlyUser from '../middlewares/onlyUser.js'
import onlyAdmin from '../middlewares/onlyAdmin.js'

const pengaduan = express.Router()

pengaduan.get("/",Pengaduan.getAll)
pengaduan.post("/",onlyUser,Pengaduan.post)
pengaduan.get("/status/:status",Pengaduan.status)
pengaduan.get("/:id",onlyAdmin,Pengaduan.getSingle)
pengaduan.patch("/process/:id",onlyAdmin,Pengaduan.patch)
pengaduan.delete("/:id",Pengaduan.del)

export default pengaduan