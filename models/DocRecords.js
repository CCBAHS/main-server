const {model, Schema} = require('mongoose');

const DocRecord = new Schema({
    doctorID: {
        type: String,
        required: [true, "Please provide a doctorID"],
    },
    patientID: {
        type: String,
        required: [true, "Please provide a patientID"],
    },
    date: {
        date:{
            type: Number,
            max: [31, "Please provide a valid date"],
            min: [1, "Please provid a valid date"],
        },
        month:{
            type: Number,
            max: [12, "Please provide a valid month"],
            min: [1, "Please provid a valid month"],
        },
        year:{
            type: Number,
        },
    },
    diagnostic: {
        type: String,
        required: [true, "Please privide a diagnostic"],
    },
    disease: {
        type: String,
        required: [true, "Please provide a disease"],
    },
    advice: [
        {
            type: String,
            required: [true, "Please provide an advice"]
        }
    ],
    medicines: [
        {
            name:{
                type: String,
                required: [true, "Please provide medicine name"],
            },
            power:{
                type: String,
                required: [true, "Please provide the power of the medicines"],
                match: [/(\d+) (Tablets|mg)/, "Please provide valid power dosage"]
            },
            duration:{
                type: String,
                required: [true, "Please provide the duration"],
            },
            dose:{
                type: String,
                required: [true, "Please provide the dose"],
            },
        },
    ],
    tests:[
        {
            name:{
                type:String,
                required: [true, "Please provide the test name"],
            },
        },
    ],
},{
    timestamps: true,
});


module.exports = new model('DocRecords', DocRecord);