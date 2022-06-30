const { campgroundSchema,reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const campground = require("./models/campground");
const Review = require("./models/reviews");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const theCampground = await campground.findById(id);
  if (!theCampground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permisison to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const {id,reviewId } = req.params;
  const theReview = await Review.findById(reviewId);
  if (!theReview.author.equals(req.user._id)) {
    req.flash("error", "You do not have permisison to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};