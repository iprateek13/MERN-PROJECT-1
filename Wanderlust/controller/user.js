let User = require("../models/user");

module.exports.getUserForm=(req, res) => {
  console.log("signup now");
  res.render("users/signup");
}

module.exports.signupNewUser=async (req, res) => {
    try {
      let { username, email, password } = req.body;

      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      // console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        return res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  }

 module.exports.getLoginForm =(req, res) => {
  res.render("users/login.ejs");
}
 module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back to the WandeLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logout=(req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are Logged out");
    res.redirect("/listings");
  });
}