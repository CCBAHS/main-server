const { model, Schema } = require('mongoose');

const PatientRecords = new Schema({
    recordID: {
        type: Schema.Types.ObjectId,
        required: [true, "Please provide a record ID"],
    },
    patientID:{
        type: String,
        required: [true, "Please provide a patient ID"],
    },
    typeRecord: {
        type: String,
        required: [true, "Please provide a record type"],
        enum: ["Doctor", "Pathology", "Radiology", "Pharmacy-Dispatch", "Appointment"],
    },
    notified: {
        type: Boolean,
        required: [true, "Please specify notified status"]
    },
}, {
    timestamps: true,
});


module.exports = new model('PatientRecords', PatientRecords);