const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  announcement: {
    type: String,
    required: true,
    unique: true
  },
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);