import mongoose from 'mongoose'

const categoriesSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true, unique: [true, 'Categories can not be the same'] },
    description: { type: String },
})

const Categories = mongoose.model('Categories', categoriesSchema)

export default Categories