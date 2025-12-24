const express = require("express")
const router = express.Router()
const postController = require("../controllers/postController")

// Main page
router.get("/main", postController.getPosts)

// New post page
router.get("/newpost", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login")
  }
  res.render("newpost")
})

// Create post
router.post("/posts", postController.createPost)

// Delete post
router.post("/posts/:id/delete", postController.deletePost)

// Like post
router.post("/posts/:id/like", postController.likePost)

module.exports = router
