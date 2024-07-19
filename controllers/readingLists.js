const router = require("express").Router();
const { ReadingList, User } = require("../models/index");
const { tokenExtractor } = require("../utils/middleware");

router.post("/", async (req, res, next) => {
  try {
    const createList = await ReadingList.create(req.body);
    res.json(createList);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const newList = await ReadingList.findByPk(req.params.id);
    if (!newList || newList.userId !== user.id) {
      return res.status(404).json({ error: "Reading list not found" });
    }
    newList.read = true;
    await newList.save();
    res.json(newList);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
