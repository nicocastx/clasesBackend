import mongoose from "mongoose";

const userCol = 'usuarios'

const userSchema = mongoose.Schema({
  email:{type: String, required: true},
  password:{type:String}
})

export const userModel = mongoose.model(userCol, userSchema)