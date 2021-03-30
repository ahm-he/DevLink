const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");

const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

// @route  POST api/user
// @desc   Register User
// @access public
// ============================= Read ==================================

router.get("/", (req, res) => {
  res.send("user route");
});
// ============================= Create ==================================
router.post(
  "/",
  [
    check("name", "Name is required!").not().isEmpty(),
    check("email", "Please provide a unique valid email").isEmail(),
    check("password", "Password required & must be six digit").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // email already exist
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exist" }] });
      }
      const avatar = gravatar.url(email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm", // default
      });
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      const salt = await bcrypt.genSalt(10); // salt for hashing
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
