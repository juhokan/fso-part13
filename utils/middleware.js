const jwt = require('jsonwebtoken');
const { SECRET } = require('./config.js');
const User = require('../models/user.js');
const Session = require('../models/session.js');

const findSessionByUserId = async (req, res, next) => {
  try {
    const decodedToken = req.decodedToken;
    if (!decodedToken.id) {
      return res.status(401).json({ error: "Token invalid" });
    }
    req.user = await User.findByPk(decodedToken.id);
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (req.user.disabled) {
      return res.status(403).json({ error: "User has been disabled" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const isValidSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      where: {
        userId: req.user.id
      }
    });
    if (!session) {
      return res.status(401).json({ error: "Session invalid" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'Token missing' });
  }
  next();
};

module.exports = { tokenExtractor, findSessionByUserId, isValidSession };
