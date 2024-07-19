const jwt = require('jsonwebtoken')
const router = require('express').Router();
const { Blog } = require('../models');
const { User } = require('../models');
const blogFinder = require('../middleware/finders');
const { SECRET } = require('../utils/config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    console.log(token);
    try {
      req.decodedToken = jwt.verify(token, 'secret');
      next();
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
};

router.get('/', async (_req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      }
    });
    console.log(JSON.stringify(blogs, null, 2));
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post('/', tokenExtractor, async (req, res, next) => {
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

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
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