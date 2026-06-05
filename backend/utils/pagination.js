const paginate = (page = 1, limit = 20) => {
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;
  return { limit, offset };
};

const paginationResult = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    }
  };
};

module.exports = { paginate, paginationResult };