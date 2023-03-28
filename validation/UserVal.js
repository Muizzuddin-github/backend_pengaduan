import validator from "validator"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class UserVal{
    username = ""
    email = ""
    password = ""
    #errors = []

    constructor(user){
        this.username = user.username
        this.email = user.email
        this.password = user.password
    }

    checkType(){
        if(typeof this.username !== "string"){
            this.#errors.push("username harus type string")
        }

        if(typeof this.email !== "string"){
            this.#errors.push("email harus bertype string")
        }

        if(typeof this.password !== "string"){
            this.#errors.push("password harus bertype string")
        }
    }

    checkLen(){
        if(this.username.length < 3){
            this.#errors.push("username minimal 3 karakter")
        }else if(this.username.length > 20){
            this.#errors.push("username maximal 20 karakter")
        }

        if(this.password.length < 6){
            this.#errors.push("password minimal 6 karakter")
        }else if(this.password.length > 225){
            this.#errors.push("password maximal 225 karakter")
        }
    }

    checkIsEmail(){
        if(!validator.isEmail(this.email)){
            this.#errors.push("email tidak valid")
        }
    }

    async checkUniqEmail(){
        const user = await prisma.users.findMany({
            where : {
                email : this.email
            }
        })

        if(user.length){
            this.#errors.push(`email dengan nama ${this.email} sudah ada`)
        }
    }

    getErrors(){
        return this.#errors
    }
}

export default UserVal