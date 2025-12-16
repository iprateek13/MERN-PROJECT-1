const express = require("express");
const router = express.Router();
let User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  console.log("signup now");
  res.render("users/signup");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;

      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      console.log(registeredUser);
      req.flash("success", "Welcome to Wanderlust!");
      return res.redirect("/listings");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to the WandeLust");
    res.redirect("/listings");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are Logged out");
    res.redirect("/listings");
  });
});
module.exports = router;
