const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    unique: true
  },
});

module.exports = mongoose.model("Event", EventSchema);