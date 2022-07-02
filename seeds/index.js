const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

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
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      author: "62bb393b377c65c0df6e5fa1",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid esse molestiae praesentium neque, deleniti quisquam eligendi ipsam laboriosam tenetur exercitationem, dolorum odio, aut quam eaque magnam. Illo eligendi est rem?",
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
