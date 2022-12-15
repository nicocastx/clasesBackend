import knex from 'knex'
import {
    options
} from './options/configsqlite.js'

/*knex(options).schema.dropTableIfExists('mensajes')
    .finally(() => {
        return knex(options).schema.createTable('mensajes', table => {
            table.increments('id').primary().unsigned()
            table.string('email', 150).notNullable()
            table.string('text', 1500)
            table.dateTime('fecha').notNullable()
        })
    })

    knex(options).schema.hasTable('productos')
    .finally(() => {
        knex(options).schema.createTable('productos', table => {
            table.increments('id').primary().unsigned()
            table.dateTime('fecha').notNullable()
            table.string('nombre', 100).notNullable()
            table.string('descripcion', 500).notNullable()
            table.string('codigo', 80).notNullable()
            table.string('url', 300).notNullable()
            table.float('precio')
            table.integer('stock').notNullable()
        })
        .finally(()=>{
            knex(options).destroy()
        })
    })*/