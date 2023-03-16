import express from 'express'
import user from './route/user.js'
import kategoriPengaduan from './route/kategoriPengaduan.js'
import ConnDB from './middlewares/connDB.js'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import morgan from 'morgan'
const prisma = new PrismaClient()

const app = express()

app.use(cors())
app.use(morgan("tiny"))
app.use(ConnDB.check)
app.use(express.json())
app.use("/user",user)
app.use("/kategori-pengaduan",kategoriPengaduan)
app.use(function(req,res){
    return res.send("invalid")
})

const server = app.listen(8080,function(){
    console.log("server is running")
})

process.on("SIGINT",async function(){
    await prisma.$disconnect()
    server.close(function(){
        console.log("server telah berhenti")
    })
})