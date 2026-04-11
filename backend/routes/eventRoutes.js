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

router.post('/:id/rsvp', async (req, res) => {
    const { userId, response } = req.body;

    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send("Event not found");

        // Remove user from both lists first (handles switching)
        event.rsvpYes = event.rsvpYes.filter(u => u.toString() !== userId);
        event.rsvpNo  = event.rsvpNo.filter(u => u.toString() !== userId);

        if (response === "yes") event.rsvpYes.push(userId);
        if (response === "no")  event.rsvpNo.push(userId);

        await event.save();

        // Populate so the frontend gets usernames back
        const updated = await event.populate("rsvpYes rsvpNo", "username");
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;