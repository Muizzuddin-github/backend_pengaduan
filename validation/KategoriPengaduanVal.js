import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class KategoriPengaduanVal{
    nama = ""
    deskripsi = ""
    #errors = []

    constructor(body){
        this.nama = body.nama
        this.deskripsi = body.deskripsi
    }

    checkType(){
        if(typeof this.nama !== "string"){
            this.#errors.push("nama kategori pengaduan harus bertype string")
        }

        if(typeof this.deskripsi !== 'string'){
            this.#errors.push("deskripsi kategori pengaduan harus bertype string")
        }
    }

    checkLen(){
        if(this.nama.length <= 2){
            this.#errors.push("nama kategori pengaduan minimal 2 karakter")
        }else if(this.nama.length > 20){
            this.#errors.push("nama kategori pengaduan maximal 20 karakter")
        }
    }

    async uniqKategori(){
        const kat = await prisma.kategori_pengaduan.findMany({
            where : {
                nama : this.nama
            }
        })

        if(kat.length){
            this.#errors.push(`kategori pengaduan dengan nama ${this.nama} sudah ada`)
        }
    }

    getErrors(){
        return this.#errors
    }
}


export default KategoriPengaduanVal