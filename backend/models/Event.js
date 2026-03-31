const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    unique: true,
    rsvp: {
      type: String,
      default: "Yes / No / Maybe"
    }
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Event", EventSchema);