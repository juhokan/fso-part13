const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')

router.get('/:id', async (req, res, next) => {
  try {
    const where = {}
    if (req.query.read) {
      where.read = req.query.read
    }    
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: [''] },
      include: [
        {
          model: Blog,
          attributes: { exclude: ['userId'] }
        },
        {
          model: Blog,
          as: 'reading', 
          attributes: { exclude: ['userId'] },
          through: {
            as: 'readingList',
            attributes: { exclude: ['userId', 'blogId', 'createdAt', 'updatedAt'] },
            where,
          },
        }
      ]
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
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