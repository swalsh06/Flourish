const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // import your User model
const eventRoutes = require("./routes/eventRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const app = express();

app.use(cors()); // allow all origins (for dev)
app.use(express.json()); // to parse JSON bodies
app.use("/events", eventRoutes); // use event routes
app.use("/announcements", announcementRoutes); // use announcement routes

// Connect to MongoDB
mongoose.connect("mongodb+srv://srwalsh:SWE-spring-26@flourish.evawcgk.mongodb.net/?appName=Flourish")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.get("/test", (req, res) => {
  res.send("Backend is working!");
});

// ----- Signup Route -----
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.send("User created");
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});

// ----- Login Route -----
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // find the user
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).send("User not found");
  }

  // compare passwords
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).send("Invalid password");
  }

  res.send("Login successful");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});