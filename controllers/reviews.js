const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//create new review....
module.exports.createReview = async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
  
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
  
    // console.log("New review Saved");
    // res.send("New review saved")
  
    res.redirect(`/listings/${listing._id}`);
  };

//delete review 
module.exports.destroyReview = async(req, res) => {
    let {id, reviewId} = req.params;
    let listing = await Listing.findById(req.params.id);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${listing._id}`)
  };