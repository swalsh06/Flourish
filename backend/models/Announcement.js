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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
}, 
{ timestamps: true}
);

module.exports = mongoose.model("Announcement", AnnouncementSchema, "announcements_v2");
