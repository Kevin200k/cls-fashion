import express from 'express';
import Categories from '../Models/categoriesModels';
import protect from '../Middlewares/authMiddleware.js'
import requireVerification from '../Middlewares/requireVerification.js'
import Restrict from '../Middlewares/restrict.js';
import logEvent from '../Middlewares/logOfEvents.js'

const router = express.Router();

router.post('/categories', protect, requireVerification, Restrict('admin'), async(req, res, next) => {
    const { name, description } = req.body;

    try{
        const category = await Categories.create({ name, description });

        if(category){
            logEvent(`category ${category._id} has been created`);
            res.status(201).json({message: "Category created successfully"})
        }
    }
    catch(err){
        next(err)
    }
} )

export default router