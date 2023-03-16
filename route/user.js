import express from 'express'
import User from '../controllers/User.js'
import Auth from '../controllers/Auth.js'

const user = express.Router()


user.get("/",User.get)
user.post("/",User.post)
user.post("/login",Auth.login)


export default user