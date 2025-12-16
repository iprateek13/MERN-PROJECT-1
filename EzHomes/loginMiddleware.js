module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "You must Logged in to create Listings");
    return res.redirect("/login");
  }
  next();
};
