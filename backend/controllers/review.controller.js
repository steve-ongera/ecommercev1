const { validationResult } = require('express-validator');
const reviewModel = require('../models/review.model');
const { paginate, paginationResult } = require('../utils/pagination');

const getProductReviews = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req.query.page, req.query.limit);
    const { reviews, total, averageRating } = await reviewModel.getProductReviews(
      req.params.productId,
      limit,
      offset
    );
    
    res.json({
      success: true,
      averageRating,
      ...paginationResult(reviews, total, req.query.page || 1, limit)
    });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product_id, rating, title, comment } = req.body;
    
    const review = await reviewModel.createReview({
      user_id: req.user.id,
      product_id,
      rating,
      title,
      comment
    });
    
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    
    const review = await reviewModel.updateReview(id, req.user.id, {
      rating,
      title,
      comment
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }
    
    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await reviewModel.deleteReview(id, req.user.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }
    
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const markHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;
    await reviewModel.markHelpful(id);
    res.json({ success: true, message: 'Marked as helpful' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
};