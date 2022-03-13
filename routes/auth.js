const router = require("express").Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

//register

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong Credentials");

    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validatePassword && res.status(400).json("Wrong Credentials");

      const {password, ...data} = user._doc;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
