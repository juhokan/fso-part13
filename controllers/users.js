const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { newUsername } = req.body;
    if (!newUsername) {
      return res.status(400).json({ error: 'New username is required' });
    }
    const user = await User.findOne({ where: { username } });
    if (user) {
      user.username = newUsername;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    next(error)
  }
});

module.exports = router