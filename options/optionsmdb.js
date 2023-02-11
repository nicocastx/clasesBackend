import mongoose from "mongoose"
import dotenv from 'dotenv'

import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config(
    {path: __dirname + '../.env'}
)

const URLDB = process.env.URLDB

export const conexionMDB = mongoose.connect(URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})