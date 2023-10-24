const mongoose = require("mongoose");

const DashboardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  actName: {
      type: String,
      required: true
  },
  actDescription: {
      type: String,
      unique: true,
  },
  actType: {
      type: String,
      required: true
  },
  actDuration: {
      type: Number,
      required: true 
  },
  actDate: {
      type: String,
      required: true,
  },
  LogDate: {
      type: Date,
      default: Date.now
  }
});

const DashboardModel = mongoose.model("Activities", DashboardSchema); 

module.exports = DashboardModel;