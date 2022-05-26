const { model, Schema } = require('mongoose');

const PathologyRecords = new Schema({
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
    departmentName: {
        type: String,
        required: [true, "Please privide a valid department name"],
        enum: ["Haematology", "Biochemistry", "Clinical-Pathology"],
    },
    investigations: [
        {
            type: String,
            required: [true, "Please provide a valid investigation"],
        }
    ],
}, {
    timestamps: true,
});


module.exports = new model('PathologyRecords', PathologyRecords);