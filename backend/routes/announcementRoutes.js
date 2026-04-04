const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const Organization = require("../models/Organization");

router.post("/", async (req, res) => {
    const { organizationId, ...announcementData } = req.body;

    const newAnnouncement = new Announcement(announcementData);
    const savedAnnouncement = await newAnnouncement.save();

    await Organization.findByIdAndUpdate(organizationId, {
        $push: { announcements: savedAnnouncement._id }
    });

    res.json(savedAnnouncement);
});

module.exports = router;