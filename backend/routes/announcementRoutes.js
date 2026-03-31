const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

router.post("/", async (req, res) => {
    console.log("POST /announcements route was hit");
    console.log(req.body);

    const newAnnouncement = new Announcement(req.body);
    const savedAnnouncement = await newAnnouncement.save();
    res.json(savedAnnouncement);
});

module.exports = router;