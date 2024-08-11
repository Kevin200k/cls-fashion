import express from 'express';
import Categories from '../Models/categoriesModel.js';
import protect from '../Middlewares/authMiddleware.js'
import requireVerification from '../Middlewares/requireVerification.js'
import Restrict from '../Middlewares/restrict.js';
import logEvent from '../Middlewares/logOfEvents.js'

const router = express.Router();

router.post('/categories', protect, requireVerification, Restrict('admin'), async(req, res, next) => {
    const { name, description } = req.body;

    try{
        const categoryExists = await Categories.findOne({name: name});
        
        if(categoryExists){
            res.status(401).json({ message: "The category already exists" })
        }
        const category = await Categories.create({ name, description });

        if(category){
            logEvent(`category ${category._id} has been created`);
            res.status(201).json({message: "Category created successfully"})
        }
    }
    catch(err){
        next(err)
    }
})

router.get('/categories', async(req, res, next) => {
    try{
        const categories = await Categories.find().select('-__v')

        if(categories){
            res.status(201).json(categories)
        }
    }
    catch(err){
        next(err)
    }
})

export default router