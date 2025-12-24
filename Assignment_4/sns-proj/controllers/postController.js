const Post = require("../models/Post")

// Create Post
exports.createPost = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.session.userId) {
      return res.redirect("/login")
    }

    const { content } = req.body

    // Create new post
    const newPost = new Post({
      author: req.session.userId,
      content: content,
    })

    await newPost.save()
    res.redirect("/main")
  } catch (error) {
    console.error("Create post error:", error)
    res.redirect("/newpost")
  }
}

// Get Posts
exports.getPosts = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.session.userId) {
      return res.redirect("/login")
    }

    // Fetch all posts sorted by creation time (newest first)
    const posts = await Post.find().sort({ createdAt: -1 })

    res.render("main", {
      username: req.session.userId,
      posts: posts,
      userRoles: req.session.roles || [],
    })
  } catch (error) {
    console.error("Get posts error:", error)
    res.redirect("/login")
  }
}

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.session.userId) {
      return res.redirect("/login")
    }

    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) {
      return res.redirect("/main")
    }

    // Check if user is author or admin
    const isAuthor = post.author === req.session.userId
    const isAdmin = req.session.roles && req.session.roles.includes("admin")

    if (!isAuthor && !isAdmin) {
      return res.redirect("/main")
    }

    await Post.findByIdAndDelete(postId)
    res.redirect("/main")
  } catch (error) {
    console.error("Delete post error:", error)
    res.redirect("/main")
  }
}

// Like Post
exports.likePost = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.session.userId) {
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.status(401).json({ error: "Unauthorized" })
      }
      return res.redirect("/login")
    }

    const postId = req.params.id
    const userId = req.session.userId
    const post = await Post.findById(postId)

    if (!post) {
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.status(404).json({ error: "Post not found" })
      }
      return res.redirect("/main")
    }

    // Check if user already liked this post
    const userLikedIndex = post.likedBy.indexOf(userId)
    let isLiked = false

    if (userLikedIndex === -1) {
      // User hasn't liked yet, add like
      post.likedBy.push(userId)
      post.likes = post.likes + 1
      isLiked = true
    } else {
      // User already liked, remove like
      post.likedBy.splice(userLikedIndex, 1)
      post.likes = Math.max(0, post.likes - 1)
      isLiked = false
    }

    await post.save()
    
    // If AJAX request, return JSON
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      return res.json({
        success: true,
        isLiked: isLiked,
        likesCount: post.likes
      })
    }
    
    // Otherwise redirect (fallback for non-JS requests)
    res.redirect("/main")
  } catch (error) {
    console.error("Like post error:", error)
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      return res.status(500).json({ error: "Internal server error" })
    }
    res.redirect("/main")
  }
}
