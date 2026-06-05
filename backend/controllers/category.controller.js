const { validationResult } = require('express-validator');
const categoryModel = require('../models/category.model');
const slugify = require('../utils/slugify');
const { paginate, paginationResult } = require('../utils/pagination');

const getCategories = async (req, res, next) => {
  try {
    const { parent_id } = req.query;
    const categories = await categoryModel.getAllCategories(parent_id);
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

const getCategoryProducts = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req.query.page, req.query.limit);
    const { products, total } = await categoryModel.getCategoryProducts(
      req.params.id,
      limit,
      offset
    );
    res.json(paginationResult(products, total, req.query.page || 1, limit));
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, parent_id, image_url } = req.body;
    const slug = slugify(name);
    
    const category = await categoryModel.createCategory({
      name,
      slug,
      description,
      parent_id,
      image_url
    });
    
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.name) {
      updates.slug = slugify(updates.name);
    }
    
    const category = await categoryModel.updateCategory(id, updates);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await categoryModel.deleteCategory(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory
};