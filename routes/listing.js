const express = require("express");
const router = express.Router();
// const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync"); // Importing wrapAsync
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//...........
const listingController = require("../controllers/listings.js")
//.......

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })//local
// const upload = multer({ storage })//cloud

//.//
//Router.route...
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,  
  upload.single("listing[imageUrl]"), validateListing, wrapAsync(listingController.createListing));

//test
// .post( upload.single("listing[imageUrl]"), (req, res)=>{
//   // res.send(req.body);
//      res.send(req.file);
// });
  
  

// Index route: List all listings
// router.get("/", wrapAsync(listingController.index));
  

// New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);


// Create new listing
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing)); 


// Show route: Display details of a single listing
router.get("/:id", wrapAsync(listingController.showListing));



// Edit form for a listing
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
  

// Update a listing
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[imageUrl]"), validateListing, wrapAsync(listingController.updateListing));



// Delete a listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;