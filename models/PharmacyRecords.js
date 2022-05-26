const { model, Schema } = require('mongoose');

const PharmacyRecord = new Schema({
    pharmacyID: {
        type: String,
        required: [true, "Please provide a pharmacy ID"],
    },
    medicine:{
        medicineName:{
            type: String,
            required: [true, "Please provide a medicine name"],
        },
        companyName:{
            type: String,
            required: [true, "Please provide a company name"],
        },
        quantityBox:{
            type: Number,
            required: [true, "Please provide quantity box"],
        },
        quantityStrip:{
            type: Number,
            required: [true, "Please provide quantity strip"],
        },
        quantityTablet:{
            type: Number,
            required: [true, "Please provide quantity tablet"],
        },
        totalTablets:{
            type: Number,
            required: [true, "Please provide total tablets"],
        },
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
    expiryDate: {
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
    pharmaStockType: {
        type: String,
        required: [true, "Please privide a valid stock type"],
        enum: ["Pharmacy-Dispatch", "Pharmacy-Purchase"],
    },
}, {
    timestamps: true,
});


module.exports = new model('PharmacyRecord', PharmacyRecord);