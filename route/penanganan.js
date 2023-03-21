import express from 'express'
import Penanganan from '../controllers/Penanganan.js'

const penangan = express.Router()

penangan.get("/",Penanganan.getAll)
penangan.post("/:id",Penanganan.post)


export default penangan