import express from "express";
import Pelayanan from "../controllers/Pelayanan.js";
import onlyAdmin from "../middlewares/OnlyAdmin.js";

const pelayanan = express.Router()
pelayanan.get('/',onlyAdmin,Pelayanan.get)
pelayanan.post('/',Pelayanan.post)
pelayanan.delete('/:id',Pelayanan.del)


export default pelayanan