import mongoose from 'mongoose'

const cartCol = 'carritos'

const cartSchema = mongoose.Schema({
    timestamp: {type: Date},
    productos: {type: Array}
})

export const cartModel =  mongoose.model(cartCol, cartSchema)