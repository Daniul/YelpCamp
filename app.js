const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = (require('method-override'));
const campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')


const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req,res) => {
    res.render('home');
})

app.get('/campgrounds', async (req,res) => {
    const campgrounds =  await campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new'); 
})

app.post('/campgrounds', async (req,res) => {
    const campgrounds = new campground(req.body.campground);
    await campgrounds.save();
    res.redirect(`/campgrounds/${campgrounds._id}`);
})

app.get('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    const theCampground = await campground.findById(id);
    res.render('campgrounds/show',{campground: theCampground});
})

app.get('/campgrounds/:id/edit',async(req,res) => {
    const theCampground = await campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground: theCampground});

})

app.put('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    //Spread into object
    const theCampground = await campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${theCampground._id}`);
})

app.delete('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


app.listen(3000, () => {
    console.log('Serving on Port 3000');
})