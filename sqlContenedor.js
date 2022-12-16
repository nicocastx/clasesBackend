import knex from 'knex'

//import { optionsMDB } from './options/configmdb.js'

class SqlContenedor {
    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async save(obj) {
        try {
            if (obj.id != undefined) {
                this.knex(this.tabla).where('id', obj.id).update(obj)
                .catch(err => console.log(err))
                const id = obj.id
                return id
            } else {
                const [id] = await this.knex(this.tabla).insert(obj)
                .catch(err => console.log(err))
                return id
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getAll() {
        try {
            return this.knex(this.tabla).select('*')
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id){
        return this.knex(this.tabla).select('*').where('id', '=', id)
    }

    async deleteById(id){
        return this.knex(this.tabla).where('id', '=', id).delete()
    }
}

/*const sql = new SqlContenedor(optionsMDB, 'productos')
sql.save(
    {
        id: 2,
        fecha: new Date(),
        nombre: "ahora te actualize a ti",
        descripcion:"asdasd",
        codigo: " 3123123",
        url: "asdasd.com",
        precio: 123,
        stock: 23
    }
)
.then(id => console.log(id))*/


export default SqlContenedor