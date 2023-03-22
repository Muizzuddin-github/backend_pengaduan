import express from 'express'
import Pengaduan from '../controllers/Pengaduan.js'
import onlyUser from '../middlewares/onlyUser.js'
import onlyAdmin from '../middlewares/onlyAdmin.js'

const pengaduan = express.Router()

pengaduan.get("/",onlyAdmin,Pengaduan.getAll)
pengaduan.post("/",onlyUser,Pengaduan.post)
pengaduan.get("/status/:status",onlyAdmin,Pengaduan.status)
pengaduan.get("/:id",onlyAdmin,Pengaduan.getSingle)
pengaduan.patch("/process/:id",onlyAdmin,Pengaduan.patch)
pengaduan.delete("/:id",Pengaduan.del)
pengaduan.get("/user/:status",onlyUser,Pengaduan.user)

export default pengaduan