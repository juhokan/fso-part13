const router = require('express').Router();
const { Blog } = require('../models');
const { Sequelize } = require('sequelize');

router.get('/', async (req, res, next) => {
  try {
    const authorsStats = await Blog.findAll({
      attributes: [
        'author',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'blogCount'],
        [Sequelize.fn('SUM', Sequelize.col('likes')), 'totalLikes']
      ],
      group: ['author'],
      order: [[Sequelize.col('totalLikes'), 'DESC']]
    });

    res.json(authorsStats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;