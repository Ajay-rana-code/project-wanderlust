const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res ,next) => {
    // console.log(req.path, "..", req.originalUrl)
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing !! ");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currentUser._id)){
      req.flash("error", "You are not the Owner of THis Listing !!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currentUser._id)){
      req.flash("error", "You are not the Owner of This Review !!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.notOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if(listing.owner._id.equals(res.locals.currentUser._id)){
      req.flash("error", "You Can't  review of Your own Listing !!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

///////////////////////////////////////
// Validation middleware for creating/updating listings
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, message); // Send validation error message
      next();
    }
    next();
}