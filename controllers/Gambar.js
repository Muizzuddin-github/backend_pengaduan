import path from "path"
import { fileURLToPath } from "url"
import fs from 'fs'

class Gambar{
    static getSingle(req,res){
        try{
            const imgName = req.params.img
            const __filename = fileURLToPath(import.meta.url)
            const __dirname = path.dirname(__filename)
            const __dirname2 = path.dirname(__dirname)
    
            const img = `/images/${imgName}`

            const checkImg = fs.existsSync(`.${img}`)
            if(!checkImg){
                return res.status(400).json({
                    status : "Bad Request",
                    message : "terjadi kesalahan diclient",
                    errors : ["gambar tidak ditemukan"],
                    data : []
                })
            }

            return res.sendFile(img,{root : `${__dirname2}`})
        }catch(err){
            return res.status(500).json({
                status : "Internal Server Error",
                message : "terjadi kesalahan diserver",
                errors : [err.message],
                data : []
            })
        }
    }
}

export default Gambar