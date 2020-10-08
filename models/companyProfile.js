const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companyProfileSchema = new Schema(
    {
        "company_name": {
            type: String,
            required: true
        },
        "company_headline": {
            type: String,
            required: true
        },
        "company_story": {
            type: String,
            required: true
        },
        "cover_photo_url": {
            type: String,
            required: true
        },
        "profile_photo_url": {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const companyProfile = mongoose.model("companies", companyProfileSchema);
module.exports = companyProfile;