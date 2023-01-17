import knex from 'knex'
import {
    optionsSQLT
} from './options/configsqlite.js'
import {optionsMDB} from './options/configmdb.js'

/*knex(optionsSQLT).schema.dropTableIfExists('mensajes')
    .finally(() => {
        return knex(optionsSQLT).schema.createTable('mensajes', table => {
            table.increments('id').primary().unsigned()
            table.string('email', 150).notNullable()
            table.string('text', 1500)
            table.dateTime('fecha').notNullable()
        })
    })

    knex(optionsMDB).schema.hasTable('productos')
    .finally(() => {
        knex(optionsMDB).schema.createTable('productos', table => {
            table.increments('id').primary().unsigned()
            table.dateTime('fecha').notNullable()
            table.string('nombre', 100).notNullable()
            table.string('descripcion', 500).notNullable()
            table.string('codigo', 80).notNullable()
            table.string('url', 300).notNullable()
            table.float('precio')
            table.integer('stock').notNullable()
        })
    })*/