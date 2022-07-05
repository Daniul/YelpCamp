const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;

//https://res.cloudinary.com/dhcfus7wi/image/upload/w_300/v1656635273/YelpCamp/bqxawgrayg9jnqhuazyu.jpg

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
},opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href=/campgrounds/${this._id}>${this.title}</a><strong><p>${this.description.substring(0,20)}...</p>`;
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await reviews.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("campground", campgroundSchema);
