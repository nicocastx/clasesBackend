import knex from 'knex'

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
            } else {
                this.knex(this.tabla).insert(obj)
                .catch(err => console.log(err))
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

export default SqlContenedor