const fs = require("fs");

/*function asignarId(info){
    let listaIds = info.map(({id}) => id)
    return listaNum.length in listaNum ? listaNum.length + 2 : listaNum.length + 1
}*/

class Contenedor{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
    }

    async save(obj){
        try{
            let id = await fs.promises.readFile(this.nombreArchivo, "utf-8")
            .then(data => {
                if(data == ""){
                    data = "[]"
                }
                console.log( "esta es la data en el save: " + data);
                let info = JSON.parse(data)
                obj.id = info.length + 1
                info.push(obj)
                fs.writeFile(this.nombreArchivo, JSON.stringify(info), (err) =>{
                    if (err){
                        throw new Error(err);
                    }
                })
                return obj.id
            })
            .then(id => id)
            .catch(console.log("concha de la lora"))
            return id
        }catch(err){
            console.log(err);
            }
    }
    
    async getById(num){
        try{
            let item = await fs.promises.readFile(this.nombreArchivo, "utf-8")
            .then(data =>{
                let info = JSON.parse(data)
                return info.find(obj => obj.id === num)
            })
            .then(obj => obj);
            return item
        }
        catch(err){
            console.log("se encontro un error al leer el archivo :\n" + err)
        }
    }

    async getAll(){
        try{
            let lista = await fs.promises.readFile(this.nombreArchivo, "utf-8")
            .then(data =>{
                let info = JSON.parse(data)
                return info
            })
            .then(
                res => res
            )
            return lista
        }catch(err){
            console.log("Ocurrio un error al obtener los archivos: \n" + err);
        }
    }

    async deleteById(num){
        try {
            fs.promises.readFile(this.nombreArchivo, "utf-8")
            .then(data =>{
                let info = JSON.parse(data)
                fs.writeFile(this.nombreArchivo, JSON.stringify(info.filter(obj => obj.id != num)), (err) =>{
                    if (err){
                        throw new Error(err);
                    }
                })
            })
        } catch (error) {
            console.log("Ocurrio un error al borrar el archivo: \n" + error);
        }
    }
};

const c1 = new Contenedor("productos.txt");

c1.save({nombre: "prueba<", razon: "ser una prueba"})
c1.deleteById(1)

/*.then(c1.getAll().then(data => console.log(data)))
.then(c1.getById(4).then(id => console.log(id)))*/





