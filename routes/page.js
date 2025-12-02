// routes/pages.js
const express = require("express");
const router = express.Router();
const Page = require("../model/page");

const defaultTimes = [
  "06:00","07:00","08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00","21:00","22:00","23:00"
];

const blankPage = (date) => ({
  date,
  startTime: "06:00",
  endTime: "23:00",
  schedule: defaultTimes.map((time) => ({ time, text: "" })),
  todos: ["", "", "", "", ""],
  priorities: "",
  notes: ""
});

// GET /api/pages/:date
router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    let page = await Page.findOne({ date });
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json(page);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/pages  (create or update)
router.post("/", async (req, res) => {
  try {
    const { date, schedule, todos, priorities, notes, startTime, endTime } = req.body;
    if (!date) return res.status(400).json({ message: "date is required" });

    const base = blankPage(date);

    const payload = {
      date,
      startTime: startTime || base.startTime,
      endTime: endTime || base.endTime,
      schedule: schedule && schedule.length ? schedule : base.schedule,
      todos: todos || base.todos,
      priorities: priorities ?? base.priorities,
      notes: notes ?? base.notes
    };

    const page = await Page.findOneAndUpdate(
      { date },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(page);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
