const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  code: {
    type: String,
    required: true,
    unique: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

});

module.exports = mongoose.model("Organization", organizationSchema);
