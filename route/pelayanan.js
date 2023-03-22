import express from "express";
import Pelayanan from "../controllers/Pelayanan.js";
import onlyAdmin from "../middlewares/onlyAdmin.js";
import onlyUser from "../middlewares/onlyUser.js";

const pelayanan = express.Router()
pelayanan.get('/',onlyAdmin,Pelayanan.get)
pelayanan.post('/',onlyUser,Pelayanan.post)
pelayanan.delete('/:id',onlyUser,Pelayanan.del)


export default pelayanan