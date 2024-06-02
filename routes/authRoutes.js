const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getAllUsers", userController.getAllUsers);

module.exports = router;
