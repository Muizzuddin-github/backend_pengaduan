class PengaduanVal{
    deskripsi = ""
    #errors = []
    constructor(data){
        this.deskripsi = data.deskripsi
    }
    
    checkType(){
        if(typeof this.deskripsi !== 'string'){
            this.#errors.push("deskripsi harus bertype string")
        }
    }

    checkLen(){
        if(this.deskripsi.length < 5){
            this.#errors.push("deskripsi minimal 5 karakter")
        }
    }

    getErrors(){
        return this.#errors
    }
}

export default PengaduanVal