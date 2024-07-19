const jwt = require('jsonwebtoken')
const router = require('express').Router();
const { Blog } = require('../models');
const { User } = require('../models');
const blogFinder = require('../middleware/finders');
const { SECRET } = require('../utils/config')
const { Op } = require('sequelize')
const { tokenExtractor, findSessionByUserId, isValidSession } = require('../utils/middleware')

router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.search) {
      const searchTerm = req.query.search.trim().toLowerCase();
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${searchTerm}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${searchTerm}%`
          }
        }
      ];
    }
    console.log(where);
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [['likes', 'DESC']]
    });

    console.log(JSON.stringify(blogs, null, 2));
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

module.exports = router;


router.post('/', tokenExtractor, findSessionByUserId, isValidSession, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    console.log(blog);
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', blogFinder, (req, res) => {
  console.log(JSON.stringify(req.blog, null, 2));
  res.json(req.blog);
});

router.delete('/:id', tokenExtractor, findSessionByUserId, isValidSession, blogFinder, async (req, res, next) => {
  try {
    if (req.blog.userId !== req.decodedToken.id) {
      const error = new Error('Invalid token');
      error.status = 403;
      throw error;
    }
    
    await req.blog.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes !== undefined ? req.body.likes : req.blog.likes;
    req.blog.author = req.body.author !== undefined ? req.body.author : req.blog.author;
    req.blog.url = req.body.url !== undefined ? req.body.url : req.blog.url;
    req.blog.title = req.body.title !== undefined ? req.body.title : req.blog.title;
    
    await req.blog.save();
    res.json(req.blog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;