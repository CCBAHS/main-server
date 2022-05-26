const { model, Schema } = require('mongoose');

const Appointment = new Schema({
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
    patientID: {
        type: String,
        required: [true, "Please provide a patientID"],
    },
    appointmentWith: {
        type: String,
        required: [true, "Please provide the appointment attender"],
    },
    tokenID: {
        type: String,
        required: [true, "Please provide a token ID"],
        unique: [true, "Please provide unique token"],
    },
    approved: {
        type: Boolean,
        required: [true, "Please provide the wether or no the appointment is approved"],
    },
    state: {
        type: String,
        required: [true, "Please provide the state of the appointment"],
        enum: ["Open", "Close"],
    },
}, {
    timestamps: true,
});

AppointmentModel = new model('Appointment', Appointment);

module.exports = {
    AppointmentModel,
}