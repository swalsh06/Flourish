const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    trim: true
  },
  readBy: {
    type: [String],
    default: []
  },
}, 
{ timestamps: true}
);

module.exports = mongoose.model("Announcement", AnnouncementSchema, "announcements_v2");
