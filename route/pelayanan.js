import express from "express";
import Pelayanan from "../controllers/Pelayanan.js";

const pelayanan = express.Router()
pelayanan.get('/',Pelayanan.get)


export default pelayanan