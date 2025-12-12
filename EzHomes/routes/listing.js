const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema} = require("../JOISchema");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings");



const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};


router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  })
);
//new route
router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});
// create new post route
router.post(
  "",
  validateListing,
  wrapAsync(async (req, res, next) => {
    //NEW LEARNING- Model.create()
    await Listing.create(req.body);
    res.redirect("");
  })
);
// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
  })
);
//edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  })
);
//put  edit route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.Listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    const { title, description, price, country, location, image } = req.body;
    const listing = await Listing.findById(req.params.id);
    // Update fields
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.country = country;
    listing.location = location;

    // Update image only if it exists in form
    if (image) {
      listing.image.url = image; // keep the object structure intact
    }
    await listing.save();
    res.redirect(`/${req.params.id}`);
  })
);

//delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlist = await Listing.findByIdAndDelete(id);
    // console.log(deletedlist);
    res.redirect("");
  })
);



module.exports = router;
