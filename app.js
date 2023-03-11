import express from 'express'
import user from './route/user.js'


const app = express()


app.use("/user",user)

app.listen(8080,function(){
    console.log("server is running")
})