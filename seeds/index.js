const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const campground = require("../models/campground");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//Picking random element from array:
//array[Math.floor(Math.random() * array.length)]
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      author: "62c502e009a17aa0b5b9cdfe",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid esse molestiae praesentium neque, deleniti quisquam eligendi ipsam laboriosam tenetur exercitationem, dolorum odio, aut quam eaque magnam. Illo eligendi est rem?",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      price: price,
      images: [
        {
          url: "https://res.cloudinary.com/dhcfus7wi/image/upload/v1656635273/YelpCamp/bqxawgrayg9jnqhuazyu.jpg",
          filename: "YelpCamp/bqxawgrayg9jnqhuazyu",
        },
        {
          url: "https://res.cloudinary.com/dhcfus7wi/image/upload/v1656635273/YelpCamp/aovqgpbacok4fip2se9j.jpg",
          filename: "YelpCamp/aovqgpbacok4fip2se9j",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});
