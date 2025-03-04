const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");




const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
   
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
         next();
    }
};


//Index Route
router.get("/", wrapAsync(async(req, res)=>{
  const allListings =  await  Listing.find({});
  res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", isLoggedIn,  (req, res) =>{
   
    res.render("listings/new.ejs");
});


//show route
router.get("/:id",  wrapAsync(async (req, res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");
   if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
   }
   res.render("listings/show.ejs", {listing});

}));
 
// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
       
  
    // console.log(req.body.listing); // Debugging ke liye

    let { title, description, price, location, country, image } = req.body.listing;

    // Agar image URL nahi diya gaya, toh default set kar do
    let imageUrl = image && image.url ? image.url : "https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1956&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image: { url: imageUrl }
    });
    

    await newListing.save();
    req.flash("success", "New Listing Created!");
    
    res.redirect("/listings");
 

}));







//Edit Route 
router.get("/:id/edit", isLoggedIn, wrapAsync( async (req, res)=>{
let {id} = req.params;
const listing = await Listing.findById(id);
if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
   }
res.render("listings/edit.ejs", {listing});
}));

//update Route
// app.put("/listings/:id", async (req, res) =>{
//     let {id}= req.params;
//    const updatedListing= await  Listing.findByIdAndUpdate(id, {...req.body.listing});
//    console.log(updatedListing);
//     res.redirect(`/listings/${id}`);
// });


// Update Route
// Update Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {

let { id } = req.params;
let { title, description, price, location, country, image } = req.body.listing;

// Pehle se jo listing hai, usko find karo
let listing = await Listing.findById(id);

// Agar user naye image URL ko nahi deta, toh purana image URL use karo
let imageUrl = image && image.url ? image.url : listing.image.url;

const updatedListing = await Listing.findByIdAndUpdate(
    id,
    {
        title,
        description,
        price,
        location,
        country,
        image: { url: imageUrl }
    },
    { new: true }
);

console.log(updatedListing);
req.flash("success", "Listing Updated!");
res.redirect(`/listings/${id}`);
}));



//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync( async (req, res)=>{
let {id}= req.params;
const deletedListing =  await Listing.findByIdAndDelete(id);
console.log(deletedListing);
req.flash("success", "Listing Deleted!");
res.redirect("/listings");
}));

module.exports = router;