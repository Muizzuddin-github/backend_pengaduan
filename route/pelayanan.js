import express from "express";
import Pelayanan from "../controllers/Pelayanan.js";

const pelayanan = express.Router()
pelayanan.get('/',Pelayanan.get)
pelayanan.post('/',Pelayanan.post)
pelayanan.delete('/:id',Pelayanan.del)


export default pelayanan