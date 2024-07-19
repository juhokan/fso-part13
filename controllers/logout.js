const router = require('express').Router();
const { Session } = require('../models');
const { tokenExtractor, findSessionByUserId, isValidSession } = require('../utils/middleware');



router.delete('/', tokenExtractor, findSessionByUserId, isValidSession, async (req, res, next) => {
    try {
      if (!req.user) {
        throw Error('No user found!')
      }
      const session = await Session.findOne({
        where: {
          userId: req.user.id
        }
      });
      await session.destroy()
      return res.status(200).json({ message: 'Successfully logged out!' })
  
    } catch (error) {
      next(error)
    }
  })

module.exports = router;