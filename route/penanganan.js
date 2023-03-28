import express from 'express'
import Penanganan from '../controllers/Penanganan.js'
import onlyAdmin from '../middlewares/onlyAdmin.js'

const penanganan = express.Router()

penanganan.get("/",Penanganan.getAll)
penanganan.post("/",onlyAdmin,Penanganan.post)


export default penanganan