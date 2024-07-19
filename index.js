require('dotenv').config()
const { Sequelize, DataTypes, Model } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2));
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/blogs', async (req, res) => {
  try {
    const { author, url, title, likes } = req.body
    const newBlog = await Blog.create({ author, url, title, likes })
    console.log(JSON.stringify(newBlog, null, 2));
    res.status(201).json(newBlog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blogId = req.params.id
    const result = await Blog.destroy({ where: { id: blogId } })
    if (result) {
      res.status(204).end()
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})