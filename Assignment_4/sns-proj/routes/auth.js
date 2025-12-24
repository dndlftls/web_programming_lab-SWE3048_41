const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

// Login page
router.get("/login", (req, res) => {
  res.render("login", { error: null })
})

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup", { error: null })
})

// Root redirect to login
router.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/main")
  } else {
    res.redirect("/login")
  }
})

// Handle login
router.post("/login", authController.loginUser)

// Handle signup
router.post("/signup", authController.signupUser)

// Handle logout
router.get("/logout", authController.logoutUser)

module.exports = router
