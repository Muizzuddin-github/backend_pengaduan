import express from 'express'
import User from '../controllers/user.js'
import Auth from '../controllers/Auth.js'

const user = express.Router()


user.get("/",User.get)
user.post("/",User.post)
user.post("/login",Auth.login)


export default user