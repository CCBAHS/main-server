const { model, Schema } = require('mongoose');

const RadiologyRecords = new Schema({
    imageURL: [
        {
            type: String,
            required: [true, "Please provide a valid scan urls"],
        }
    ],
    laboratoryID: {
        type: String,
        required: [true, "Please provide a laboratory ID"],
    },
    patientID: {
        type: String,
        required: [true, "Please provide a valid patient ID"]
    },
    date: {
        date: {
            type: Number,
            max: [31, "Please provide a valid date"],
            min: [1, "Please provid a valid date"],
        },
        month: {
            type: Number,
            max: [12, "Please provide a valid month"],
            min: [1, "Please provid a valid month"],
        },
        year: {
            type: Number,
        },
    },
    scanType: {
        type: String,
        required: [true, "Please privide a valid scan type"],
        enum: ["X-Ray", "Ultrasound", "CT-Scan", "MRI"],
    },
    bodyPart: {
        type: String,
        required: [true, "Please provide a valid body part"],
    },
    observations: [
        {
            type: String,
            required: [true, "Please provide a valid observation"]
        }
    ],
    impressions: [
        {
                type: String,
                required: [true, "Please provide a valid impression"],
        },
    ],
}, {
    timestamps: true,
});


module.exports = new model('RadiologyRecords', RadiologyRecords);