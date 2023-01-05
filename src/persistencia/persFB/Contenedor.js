import {
    db
} from '../configFB.js'
import { doc, deleteDoc } from "firebase/firestore";

export class contenedorFB {
    constructor(col) {
        this.col = db.collection(col)
    }

    async save(obj) {
        return await this.col.add(obj)
    }

    async getAll() {
        const res = []
        await this.col.get()
        .then(data => data.forEach(doc => {
            
            res.push({id: doc.id, ... doc.data()})
        }))
        return res
    }

    async getById(id){
        const res = await this.getAll()
        .then(data =>{
            return data.find(item => item.id === id)
        })
        return res
    }

    async deleteById(id){
        return await this.col.doc(id).delete()
    }
}


