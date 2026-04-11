const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  place: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rsvpYes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rsvpNo:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

},
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);