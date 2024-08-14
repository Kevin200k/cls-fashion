import express from 'express';
import Categories from '../Models/categoriesModel.js';
import protect from '../Middlewares/authMiddleware.js';
import requireVerification from '../Middlewares/requireVerification.js';
import Restrict from '../Middlewares/restrict.js';
import logEvent from '../Middlewares/logOfEvents.js';

const router = express.Router();

// Route to create a category
router.post('/categories', protect, requireVerification, Restrict('admin'), async (req, res, next) => {
    const { name, description } = req.body;

    try {
        const categoryExists = await Categories.findOne({ name: name });

        if (categoryExists) {
            return res.status(409).json({ message: "Category already exists. Please choose a different name." });
        }

        const category = await Categories.create({ name, description });

        if (category) {
            logEvent(`Category ${category._id} has been created.`);
            return res.status(201).json({ message: "Category created successfully." });
        }

        // Fallback if category creation failed for any unknown reason
        res.status(500).json({ message: "Failed to create category. Please try again later." });
    } catch (err) {
        next(err);
    }
});

// Route to get all categories
router.get('/categories', async (req, res, next) => {
    try {
        const categories = await Categories.find().select('-__v');

        if (categories.length > 0) {
            return res.status(200).json(categories);
        } else {
            return res.status(404).json({ message: "No categories found." });
        }
    } catch (err) {
        next(err);
    }
});

// Route to delete a category
router.delete('/categories/:categoryId', protect, requireVerification, Restrict('admin'), async (req, res, next) => {
    const { categoryId } = req.params;

    try {
        const category = await Categories.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        await Categories.findByIdAndDelete(categoryId);
        logEvent(`Category ${categoryId} has been deleted.`);
        res.status(200).json({ message: "Category deleted successfully." });
    } catch (err) {
        next(err);
    }
});

export default router;
