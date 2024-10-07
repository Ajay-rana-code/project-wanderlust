const Listing = require("../models/listing");


//index......
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  };

//render new listing form...
module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("./listings/new.ejs");
  };

//show one listing.......
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
     })
    .populate("owner");
    if (!listing) {
      //throw new ExpressError(404, "Listing not found"); // Use ExpressError for missing listing
      req.flash("error", e.message);
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
  };

//create new listing...
module.exports.createListing = async (req, res) => {
   let url = req.file.path;
   let filename = req.file.filename;

    const listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.imageUrl = {url, filename}; 
    await newListing.save();
    req.flash("success", "New listing created !!");
    res.redirect("/listings");
  };

//render edit form..
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id); 
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    let originalImageUrl = listing.imageUrl.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_500");
    res.render("./listings/edit.ejs", { listing , originalImageUrl});
  };

//update listing....
module.exports.updateListing = async (req, res) => {

    const { id } = req.params;

    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currentUser._id)){
    //   req.flash("error", "You dont have permission to edit !!");
    //   return res.redirect(`/listings/${id}`);
    // }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      updatedListing.imageUrl = {url, filename}; 
      await updatedListing.save();
    }

    if (!updatedListing) {
      throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing Updated !!");
    res.redirect(`/listings/${id}`);
  };

//delete listing...
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing Deleted !!");
    res.redirect("/listings");
  };