const errorHandler = (err, _req, res, _next) => {
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: ['Unique constraint failed: ' + err.errors.map(e => e.message).join(', ')]
    });
  }

  console.error(err);
  res.status(500).json({
    error: 'An unexpected error occurred'
  });
};

module.exports = errorHandler;