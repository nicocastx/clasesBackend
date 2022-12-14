const fs = require("fs");

function asignarId(info){
    let listaNum = info.map(({id}) => id)
    return listaNum.includes(listaNum.length + 1) ? (Math.max(...listaNum) + 1) : (listaNum.length + 1)
}

class Contenedor{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
    }

    async save(obj){
        try{
            let id = await this.getAll()
            .then(data => {
                if (obj.id == undefined){
                    obj.id = asignarId(data)
                }
                let existeId = -1
                existeId = data.findIndex(prod => prod.id === obj.id)
                if (existeId != -1){
                    data[existeId] = obj
                } else{
                    data.push(obj)
                }
                fs.writeFile(this.nombreArchivo, JSON.stringify(data, null, 2), (err) =>{
                    if (err){
                        throw new Error(err);
                    }
                })
                return obj.id
            })
            .then(id => id)
            .catch((err) =>{
                obj.id = 1
                fs.promises.appendFile(this.nombreArchivo, JSON.stringify(obj, null, 2))
                console.log('hola, acabo de crear un archivo');
            })
            return id
        }catch(err){
            
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
                if(data == ""){
                    data = "[]"
                }
                let info = JSON.parse(data)
                return info
            })
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
                fs.writeFile(this.nombreArchivo, JSON.stringify(info.filter(obj => obj.id != num), null, 2), (err) =>{
                    if (err){
                        throw new Error(err);
                    }
                })
            })
        } catch (error) {
            console.log("Ocurrio un error al borrar el archivo: \n" + error);
        }
    }
    
    async deleteAll(){
        try {
            fs.promises.writeFile(this.nombreArchivo, "")
        } catch (error) {
            console.log("ocurrio un error borrando el archivo: " + error);
        }
    }
};


module.exports = Contenedor


/*async function asd(){
    const c1 = new Contenedor("productoszzz.txt");
    //let id =  await c1.getAll()
    c1.save({id:8, nombre: "pruebaxdxd", razon: "ser una prueba"})
    //.then(() => c1.getById(2).then(data => console.log(data)))
}
/*    let lista = await c1.getAll();
    let obj = await c1.getById(1)
    console.log("el id:" + id);
    lista.map(producto => console.log(producto));
    console.log("el objeto: ");
    console.log(obj);
    c1.deleteById(1)
    c1.deleteAll()
}*/

/*.then(c1.getAll().then(data => console.log(data)))
.then(c1.getById(4).then(id => console.log(id)))*/

//asd()



