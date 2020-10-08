require('dotenv').config()
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const companyProfile = require('./models/companyProfile');

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
    res.render("index")
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

app.use((req, res) => {
    res.render("404")
})