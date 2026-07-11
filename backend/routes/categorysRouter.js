import express from 'express';
import { getCategorys, addCategory, getCategoryById, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategorys);  
router.get('/:id', getCategoryById);  
router.post('/', addCategory);  
router.put('/:id', updateCategory);  
router.delete('/:id', deleteCategory);  

export default router;
