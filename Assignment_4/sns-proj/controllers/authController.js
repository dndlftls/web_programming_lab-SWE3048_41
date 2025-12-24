const bcrypt = require("bcrypt")
const User = require("../models/User")

// Signup User
exports.signupUser = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body

    // Validate passwords match
    if (password !== confirmPassword) {
      return res.render("signup", { error: "Passwords do not match" })
    }

    // Check if username already exists
    const existingUser = await User.findOne({ id: username })
    if (existingUser) {
      return res.render("signup", { error: "Username already taken" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      id: username,
      password: hashedPassword,
      roles: ["user"],
    })

    await newUser.save()
    res.redirect("/login")
  } catch (error) {
    console.error("Signup error:", error)
    res.render("signup", { error: "An error occurred during signup" })
  }
}

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await User.findOne({ id: username })
    if (!user) {
      return res.render("login", { error: "Invalid credentials" })
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.render("login", { error: "Invalid credentials" })
    }

    // Initialize session
    req.session.userId = user.id
    req.session.roles = user.roles
    res.redirect("/main")
  } catch (error) {
    console.error("Login error:", error)
    res.render("login", { error: "An error occurred during login" })
  }
}

// Logout User
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err)
    }
    res.redirect("/login")
  })
}
