import mongoose from 'mongoose'

const categorieSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true, unique: [true, 'Categories can not be the same'] },
    description: { type: String },
})

const Categories = mongoose.model('Categories', categorieSchema)

export default Categories