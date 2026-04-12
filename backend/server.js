const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // import your User model
const Organization = require("./models/Organization");
const Event = require("./models/Event");
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

  // find the user and/or admin
  const user = await User.findOne({ username }).populate({
    path: "organizations",
    populate: [
      { path: "members", select: "username" },
      { path: "admins", select: "username" }
    ]
  });

  if (!user) {
    return res.status(400).send("User not found");
  }

  // compare passwords
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).send("Invalid password");
  }

  res.json({
    userId: user._id,
    username: user.username,
    organizations: user.organizations
  });
});

//--Create org--
app.post("/organizations/create", async (req, res) => {
  const { name, userId } = req.body;
  try {
    const existing = await Organization.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) return res.status(400).send("An organization with that name already exists");
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const org = new Organization({ 
      name, 
      code, 
      owner: userId, 
      admins: [], 
      members: [] 
    });

    await org.save();
    await User.findByIdAndUpdate(userId, { $push: { organizations: org._id } });
    res.json(org);
  } catch (error) {
    res.status(500).send("Error creating organization");
  }
});

//--Join org by code--
app.post("/organizations/join", async (req, res) => {
  const { code, userId } = req.body;
  try {
    const org = await Organization.findOne({ code });
    if (!org){
      return res.status(404).send("Organization not found");
    } 

    if (org.members.includes(userId) || org.owner.toString() === userId){
      return res.status(400).send("Already in this organization");
    }
      
    org.members.push(userId);
    await org.save();
    await User.findByIdAndUpdate(userId, { $push: { organizations: org._id } });
    const populatedOrg = await Organization.findById(org._id).populate("members", "username");
    res.json(org);
  } catch (error) {
    res.status(500).send("Error joining organization");
  }
});

//--Get user's orgs--
app.get("/organizations/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("organizations");
    res.json(user.organizations);
  } catch (error) {
    res.status(500).send("Error fetching organizations");
  }
});

//--Get events for an org--
app.get("/organizations/:id/events", async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).populate({
      path: "events",
      populate: { path: "rsvpYes rsvpNo", select: "username" }
    });
    if (!org) return res.status(404).send("Organization not found");
    res.json(org.events);
  } catch (error) {
    res.status(500).send("Error fetching events");
  }
});

//--Get announcements for an org--
app.get("/organizations/:id/announcements", async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).populate("announcements");
    if (!org) return res.status(404).send("Organization not found");
    res.json(org.announcements);
  } catch (error) {
    res.status(500).send("Error fetching announcements");
  }
});

//--Promote member to admin--
app.post("/organizations/:id/admins", async (req, res) => {
  const { userId } = req.body;
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).send("Organization not found");
    if (org.admins.includes(userId)) return res.status(400).send("Already an admin");
    org.admins.push(userId);
    await org.save();
    const populated = await Organization.findById(org._id)
      .populate("members", "username")
      .populate("admins", "username");
    res.json(populated);
  } catch (err) {
    res.status(500).send("Error promoting to admin");
  }
});

//--Demote admin back to member--
app.delete("/organizations/:id/admins/:userId", async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).send("Organization not found");
    org.admins = org.admins.filter(a => a.toString() !== req.params.userId);
    await org.save();
    const populated = await Organization.findById(org._id)
      .populate("members", "username")
      .populate("admins", "username");
    res.json(populated);
  } catch (err) {
    res.status(500).send("Error demoting admin");
  }
});

//--Remove member from org--
app.delete("/organizations/:id/members/:userId", async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).send("Organization not found");
    org.members = org.members.filter(m => m.toString() !== req.params.userId);
    org.admins = org.admins.filter(a => a.toString() !== req.params.userId);
    await org.save();

    // Remove their RSVPs from all org events
    const Event = require("./models/Event");
    await Event.updateMany(
        { _id: { $in: org.events } },
        { 
            $pull: { 
                rsvpYes: new mongoose.Types.ObjectId(req.params.userId),
                rsvpNo: new mongoose.Types.ObjectId(req.params.userId)
            } 
        }
    );

    await User.findByIdAndUpdate(req.params.userId, { $pull: { organizations: org._id } });
    const populated = await Organization.findById(org._id)
      .populate("members", "username")
      .populate("admins", "username");
    res.json(populated);
  } catch (err) {
    res.status(500).send("Error removing member");
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});