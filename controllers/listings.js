const Listing = require("../models/listing");




module.exports.index = async(req, res)=>{
    const allListings =  await  Listing.find({});
    res.render("listings/index.ejs", {allListings});
  };

  module.exports.renderNewForm =  (req, res) =>{
   
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id)
   .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
   .populate("owner");
  
   if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
   }
   res.render("listings/show.ejs", {listing});

}

module.exports.createListing = async (req, res, next) => {
       
  
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
    
    newListing.owner = req.user._id;
    console.log(req.user);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    
    res.redirect("/listings");
 

};


module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
       }
    res.render("listings/edit.ejs", {listing});
    };

    module.exports.updateListing = async (req, res) => {

        let { id } = req.params;
        let { title, description, price, location, country, image } = req.body.listing;
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
    };

    module.exports.destroyListing = async (req, res)=>{
        let {id}= req.params;
        const deletedListing =  await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
        };