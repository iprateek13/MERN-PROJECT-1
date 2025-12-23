const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../Middleware");
const userController = require("../controller/user");

//signup new user
//get route-login
router
  .route("/signup")
  .get(userController.getUserForm)
  .post(wrapAsync(userController.signupNewUser));

//login route //logout
router
  .route("/login")
  .get(userController.getLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);
module.exports = router;
