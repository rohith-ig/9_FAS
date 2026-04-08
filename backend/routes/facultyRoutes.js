const express = require("express");
const router = express.Router();

const { facultyAddSlots, facultyDeleteSlots } = require("../controllers/facultyController");
const { check } = require("../middlewares/roleCheck"); 

router.post("/faculty/add-slots", check, facultyAddSlots);

router.delete("/faculty/delete-slots", check, facultyDeleteSlots);

module.exports = router;