const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  announcement: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  rsvp: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
