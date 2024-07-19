const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id);
    if (req.blog) {
      next();
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = blogFinder;