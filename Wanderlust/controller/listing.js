const Listing = require("../models/listings");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
};
module.exports.renderNewForm = (req, res) => {
  // console.log(req.user);
  res.render("listing/new.ejs");
};
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing that you are requested does not exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listing/show.ejs", { listing });
};
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing created");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing that you are requested does not exist");
    return res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250")
  res.render("listing/edit.ejs", { listing , originalImageUrl});
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // Directly update using req.body.listing
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Review updated");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
