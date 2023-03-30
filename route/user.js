import express from 'express'
import UserControl from '../controllers/UserControl.js'
import Auth from '../controllers/Auth.js'
import onlyLogin from '../middlewares/onlyLogin.js'

const user = express.Router()


user.get("/",UserControl.get)
user.post("/",UserControl.post)
user.post("/login",Auth.login)
user.get("/logout",Auth.logout)
user.get("/refresh-access-token",onlyLogin,Auth.refreshAccessToken)


export default user