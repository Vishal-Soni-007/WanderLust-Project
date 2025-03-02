const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=1170&auto=format&fit=crop",
    },
},
  price: Number,
  location: String,
  country: String,
 reviews: [
  {
    type: Schema.Types.ObjectId,
    ref: "Review"
  }
 ]
});

listingSchema.post("findOneAndDelete", async ( listing) =>{
  if(listing){
    await review.deleteMany({_id: {$in: listing.reviews}});
  }
})



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;