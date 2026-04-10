const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Organization = require("../models/Organization");

router.post("/", async (req, res) => {
    const { organizationId, ...eventData } = req.body;

    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();

    await Organization.findByIdAndUpdate(organizationId, {
        $push: { events: savedEvent._id }
    });

    res.json(savedEvent);
});

module.exports = router;