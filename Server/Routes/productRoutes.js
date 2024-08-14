import express from 'express';
import Product from '../Models/productModel';
import Categories from '../Models/categoriesModel';
import requireVerification from '../Middlewares/requireVerification.js'
import protect from '../Middlewares/authMiddleware.js'
import Restrict from '../Middlewares/restrict.js'

const router = express.Router();

router.post('/products', protect, requireVerification, Restrict('admin'), async(req, res, next) => {
    const { name, description, price, size, quantity } = req.body;

    try{
        const product = await Product.create({ name, description, price, size, quantity })
    }

    catch(err){
        next(err)
    }

})