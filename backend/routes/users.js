const express = require("express");
const router = express.Router();
const {check} = require("../middlewares/roleCheck")

const {
  addUser,
  deleteUser,
  getUsers
} = require("../controllers/userController");

router.get("/",check, getUsers);
router.post("/add", addUser);
router.delete("/:id", deleteUser);

module.exports = router;
