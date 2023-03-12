import express from 'express'
import User from '../controllers/user.js'

const user = express.Router()


user.get("/",User.get)
user.post("/",User.post)


export default user