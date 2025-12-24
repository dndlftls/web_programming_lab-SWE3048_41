const mongoose = require("mongoose")
const Post = require("./models/Post")

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/nodejs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB")
    console.log("Starting migration...")

    try {
      // Find all posts
      const posts = await Post.find()
      console.log(`Found ${posts.length} posts to migrate`)

      let migrated = 0
      let skipped = 0

      for (const post of posts) {
        // Check if post already has the new structure (likes is number)
        if (typeof post.likes === 'number') {
          // If likedBy doesn't exist, initialize it
          if (!post.likedBy || !Array.isArray(post.likedBy)) {
            post.likedBy = []
            await post.save()
            skipped++
            console.log(`Post ${post._id}: Initialized likedBy field`)
          } else {
            skipped++
            console.log(`Post ${post._id}: Already migrated, skipped`)
          }
          continue
        }

        // Old structure: likes is an array
        if (Array.isArray(post.likes)) {
          const likedBy = [...post.likes] // Copy the array
          const likesCount = likedBy.length

          // Update post with new structure using updateOne to bypass Mongoose validation
          await Post.updateOne(
            { _id: post._id },
            {
              $set: {
                likes: likesCount,
                likedBy: likedBy
              }
            }
          )

          migrated++
          console.log(`Post ${post._id}: Migrated (${likesCount} likes)`)
        } else {
          // Unknown structure, initialize with defaults
          await Post.updateOne(
            { _id: post._id },
            {
              $set: {
                likes: 0,
                likedBy: []
              }
            }
          )
          migrated++
          console.log(`Post ${post._id}: Initialized with defaults`)
        }
      }

      console.log("\n✅ Migration completed!")
      console.log(`Migrated: ${migrated} posts`)
      console.log(`Skipped: ${skipped} posts`)
      
      process.exit(0)
    } catch (error) {
      console.error("Migration error:", error)
      process.exit(1)
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

