const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = require("./models/User")

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/nodejs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB")

    const username = "admin"
    const password = "admin123"

    try {
      // Check if admin user already exists
      const existingUser = await User.findOne({ id: username })
      
      if (existingUser) {
        // Update existing user to be admin
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUser.password = hashedPassword
        existingUser.roles = ["admin"]
        await existingUser.save()
        console.log(`✅ Admin user "${username}" updated successfully!`)
      } else {
        // Create new admin user
        const hashedPassword = await bcrypt.hash(password, 10)
        const adminUser = new User({
          id: username,
          password: hashedPassword,
          roles: ["admin"],
        })
        await adminUser.save()
        console.log(`✅ Admin user "${username}" created successfully!`)
      }

      console.log(`Username: ${username}`)
      console.log(`Password: ${password}`)
      console.log(`Roles: admin`)
      
      process.exit(0)
    } catch (error) {
      console.error("Error creating admin user:", error)
      process.exit(1)
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

