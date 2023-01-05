import mongoose from "mongoose"

const URL = 'mongodb+srv://nicocastx:qwerty654321@coderbackend.pv6yegc.mongodb.net/proyectoFinal?retryWrites=true&w=majority'

export const conexionMDB = mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})




