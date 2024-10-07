const express = require("express");
const router = express.Router( { mergeParams: true } );
const wrapAsync = require("../utils/wrapAsync"); 
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor, notOwner } = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");




// Validation middleware for creating review
function validateReview(req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, message); // Send validation error message
    }
    next();
  }


//create reviews route

router.post("/", isLoggedIn, notOwner , validateReview, wrapAsync(createReview));
  
//del review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(destroyReview))
  

module.exports = router;