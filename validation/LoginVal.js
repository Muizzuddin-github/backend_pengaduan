import { PrismaClient } from "@prisma/client";
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

class LoginVal{
    id = 0
    status = ""
    #email = ""
    #password = ""
    #passwordDB = ""
    #errors = []

    constructor(user){
        this.#email = user.email
        this.#password = user.password
    }

    checkType(){
        if(typeof this.#email !== 'string'){
            this.#errors.push('email harus bertype string')
        }

        if(typeof this.#password != 'string'){
            this.#errors.push('password harus bertype string')
        }
    }

    async checkEmailExits(){
        const user = await prisma.users.findMany({
            where : {
                email : this.#email
            },
            include : {
                roles : true
            }
        })

        console.log(user)

        if(user.length){
            this.id = user[0].id
            this.status = user[0].roles.role
            this.#passwordDB = user[0].password
        }else{
            this.#errors.push("user tidak ditemukan")
        }
    }

    checkPassword(){
        const check = bcryptjs.compareSync(this.#password,this.#passwordDB)

        if(!check){
            this.#errors.push("password yang anda masukkan salah")
        }
    }



    getErrors(){
        return this.#errors
    }
}


export default LoginVal