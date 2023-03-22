import express from 'express'
import User from '../controllers/User.js'
import Auth from '../controllers/Auth.js'
import onlyLogin from '../middlewares/onlyLogin.js'

const user = express.Router()


user.get("/",User.get)
user.post("/",User.post)
user.post("/login",Auth.login)
user.get("/logout",Auth.logout)
user.get("/refresh-access-token",onlyLogin,Auth.refreshAccessToken)


export default user