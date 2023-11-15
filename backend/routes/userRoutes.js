const express = require("express");
const { registerUser, LoginUser, allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

//Register New User -> POST  && Get All Users -> GET
router.route("/").post(registerUser).get(protect, allUsers)

//Login User -> POST
router.post("/login", LoginUser)



module.exports = router;