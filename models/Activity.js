const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    actName: {
        type: String,
        required: true
    },
    actDescription: {
        type: String
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


const ActivityModel = mongoose.model("Activity", userSchema); 

module.exports = ActivityModel;