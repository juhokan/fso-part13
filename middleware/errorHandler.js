const errorHandler = (err, _req, res, _next) => {
  console.error(err.stack);
  
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validation error: ' + err.errors.map(e => e.message).join(', ') });
  }
  
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'Database error: ' + err.message });
  }
  
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;