const express = require("express");
const {
    registerUser,
    loginUser,
    getAllUsers,
} = require("../controllers/userControllers");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/allusers").get( getAllUsers);

module.exports = router;
