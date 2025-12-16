const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ejsMate = require("ejs-mate");

const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const ExpressError = require("./utils/ExpressError");

const MONGO_URL = "mongodb://127.0.0.1:27017/EzHomes";

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  name: "mySessionId",
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// demo user route (testing only)
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student1@gmail.com",
//     username: "sigma-student",
//   });

//   let demoUser =
//   res.send(demoUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// -------------------- 404 HANDLER --------------------
app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
});

// -------------------- SERVER --------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
