// models/Page.js
const mongoose = require("mongoose");

const ScheduleSlotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true }, // "06:00"
    text: { type: String, default: "" }
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // "YYYY-MM-DD"
    startTime: { type: String, default: "06:00" },
    endTime: { type: String, default: "23:00" },
    schedule: [ScheduleSlotSchema],
    todos: [{ type: String }],
    priorities: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", PageSchema);
