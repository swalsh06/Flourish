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
  rsvps: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      status: {
        type: String,
        enum: ['yes', 'no', 'maybe'],
      }
    }
  ]
},
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);