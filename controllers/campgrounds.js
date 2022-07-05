const campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campgrounds = new campground(req.body.campground);
  campgrounds.geometry = geoData.body.features[0].geometry;
  campgrounds.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campgrounds.author = req.user._id;
  await campgrounds.save();
  console.log(campgrounds);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campgrounds._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const theCampground = await campground
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!theCampground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground: theCampground });
};

module.exports.renderEditCampground = async (req, res) => {
  const { id } = req.params;
  const theCampground = await campground.findById(req.params.id);
  if (!theCampground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground: theCampground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  //Spread into object
  const theCampground = await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  theCampground.images.push(...imgs);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await theCampground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await theCampground.save();
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${theCampground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
