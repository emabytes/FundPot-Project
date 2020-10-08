const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactDataSchema = new Schema(
    {
        "name": {
            type: String,
            required: true
        },
        "email": {
            type: String,
            required: true
        },
        "phone": {
            type: String,
            required: true
        },
        "body": {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const contactData = mongoose.model("contactDb", contactDataSchema);
module.exports = contactData;