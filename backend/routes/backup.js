const express = require("express");
const router = express.Router();
const { generateBackup } = require("../controllers/backupController");
const {check} = require("../middlewares/roleCheck")

router.post("/generate",check, generateBackup);

module.exports = router;
