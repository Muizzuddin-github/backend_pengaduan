class PengaduanVal{
    deskripsi = ""
    pengaduanID = 0
    #errors = []
    constructor(data){
        this.deskripsi = data.deskripsi
        this.pengaduanID = data.pengaduanID
    }
    
    checkType(){
        if(typeof this.deskripsi !== 'string'){
            this.#errors.push("deskripsi harus bertype string")
        }

        const check = +this.pengaduanID.toString()

        if(check === "NaN"){
            this.#errors.push("pengaduanID harus angka")
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