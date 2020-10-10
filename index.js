require('dotenv').config()
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const companyProfile = require('./models/companyProfile');
const contactData = require('./models/contactData');

const PORT = process.env.PORT || 3003;

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs')

const dbURI = `${process.env.dbURI}`
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("connected to db!")
        app.listen(PORT, () => {
            console.log(`server is running on http://localhost:${PORT}`)
        })
            .catch(err => console.log(err))
    })

app.get("/", (req, res) => {
    companyProfile.aggregate([{ $sample: { size: 6 } }])
        .then(result => {
            res.status(200).render("index", { profile: result })
        })
        .catch(err => console.log(err))
})

app.get("/createCompanyProfile", (req, res) => {
    res.render('createCompanyProfile')
});

app.post("/createCompanyProfile", (req, res) => {
    const newCompanyProfile = new companyProfile({
        company_name: req.body.name,
        company_headline: req.body.headline,
        company_story: req.body.story,
        cover_photo_url: req.body.cover_photo_url,
        profile_photo_url: req.body.profile_photo_url
    })
    newCompanyProfile.save()
        .then(result => {
            console.log("new profile saved to db!")
            res.redirect("/companyProfileList")
        })
        .catch(err => console.log(err))
});

app.get('/companyProfileList', (req, res) => {
    companyProfile.find({})
        .then(result => {
            res.render('companyProfileList', { profileData: result })
        })
        .catch(err => console.log(err))
})

app.get('/companyProfilePage/:id', (req, res) => {
    companyProfile.findById(req.params.id)
        .then(result => {
            res.render('companyProfilePage', { profile: result })
        })
        .catch(err => console.log(err))
});

app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/search", (req, res) => {
    res.render('companyProfileList', { profileData: [] })
})

app.post('/search', (req, res) => {
   res.status(200).redirect(`/search/${req.body.search}`)
})

app.get('/search/:id', (req, res) => {
    console.log(`search query ` + req.params.id)
    companyProfile.find({ company_name: { $regex: new RegExp(req.params.id, 'i') } })
        .then(result => {
            res.render('companyProfileList', { profileData: result })
        })
        .catch(err => console.log(err))
})

app.post('/contact', (req, res) => {
    const newContactData = new contactData({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        body: req.body.body,
    })
    newContactData.save()
        .then(result => {
            console.log("new contact request saved to db!")
            res.status(200).redirect("/")
        })
        .catch(err => console.log(err))
})

app.use((req, res) => {
    res.render("404")
})