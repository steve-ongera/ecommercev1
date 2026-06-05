const { validationResult } = require('express-validator');
const productModel = require('../models/product.model');
const cloudinary = require('../config/cloudinary');
const slugify = require('../utils/slugify');
const { paginate, paginationResult } = require('../utils/pagination');

const getProducts = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req.query.page, req.query.limit);
    const { category, minPrice, maxPrice, sort, featured } = req.query;
    
    const filters = { category, minPrice, maxPrice, featured };
    const sortOption = sort || '-created_at';
    
    const { products, total } = await productModel.getAllProducts(filters, sortOption, limit, offset);
    
    res.json(paginationResult(products, total, req.query.page || 1, limit));
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q, limit, offset } = paginate(req.query.page, req.query.limit);
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const { products, total } = await productModel.searchProducts(q, limit, offset);
    res.json(paginationResult(products, total, req.query.page || 1, limit));
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await productModel.getFeaturedProducts(limit);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await productModel.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, compare_price, stock, category_id, is_featured } = req.body;
    const slug = slugify(name);
    
    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }
    
    const productData = {
      name,
      slug,
      description,
      price: parseFloat(price),
      compare_price: compare_price ? parseFloat(compare_price) : null,
      stock: parseInt(stock),
      category_id,
      images: imageUrls,
      is_featured: is_featured === 'true'
    };
    
    const product = await productModel.createProduct(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.name) {
      updates.slug = slugify(updates.name);
    }
    
    const product = await productModel.updateProduct(id, updates);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await productModel.deleteProduct(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    const product = await productModel.updateStock(id, parseInt(stock));
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
};