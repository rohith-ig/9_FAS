const express = require("express");
const router = express.Router();

const {
  addUser,
  deleteUser,
  getUsers
} = require("../controllers/userController");

router.get("/", getUsers);
router.post("/add", addUser);
router.delete("/:id", deleteUser);

module.exports = router;
