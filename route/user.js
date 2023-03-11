import express from 'express'
import { getUser } from '../controllers/user.js'

const user = express.Router()


user.get("/",getUser)


export default user