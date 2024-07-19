const router = require('express').Router();
const { Blog } = require('../models');
const blogFinder = require('../middleware/finders');

router.get('/', async (_req, res, next) => {
  try {
    const blogs = await Blog.findAll();
    console.log(JSON.stringify(blogs, null, 2));
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { author, url, title, likes } = req.body;
    const newBlog = await Blog.create({ author, url, title, likes });
    console.log(JSON.stringify(newBlog, null, 2));
    res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', blogFinder, (req, res) => {
  console.log(JSON.stringify(req.blog, null, 2));
  res.json(req.blog);
});

router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
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