const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { SECRET } = require('../utils/config');
const User = require('../models/user');
const Session = require('../models/session');

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    const passwordCorrect = password === 'secret';

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      });
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, SECRET);

    await Session.destroy({
      where: {
        userId: user.id,
      }
    });

    if (user.disabled === false) {
      await Session.create({
        userId: user.id,
        token,
      });
    } else {
      throw new Error('User has been disabled');
    }

    res.status(200).send({ token, username: user.username, name: user.name });
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      error: 'Log in failed! Check username and password!'
    });
  }
});

module.exports = router;
