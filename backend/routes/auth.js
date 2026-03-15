const express = require("express");
const router = express.Router();
const { callback } = require("../controllers/authController");

router.get("/callback", callback);

module.exports = router;    