import mongoose from 'mongoose';
import Categories from './categoriesModel.js'

const sizeSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number,  required: true },
})

const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
    description: { type: String },
    sizes: [sizeSchema], 
    color: { type: String, required: true },
    createdAt: { type: Date, required: true, immutable: true, default: date.now },
    lastUpdated: { type: Date, required: true, default: date.now },
    // productImage: { type: Object },
})

const Product = mongoose.model('Product', productSchema);

export default Product;