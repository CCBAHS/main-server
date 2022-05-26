
const checkAuth = require("../../authentication/auth");
const { AppointmentModel } = require("../../models/AppointmentRecords");
const { AuthenticationError } = require("apollo-server");
const { default: axios } = require("axios");
const { ProduceFinalAddedRecords } = require("../../validators/FinalRecords");
const PatientRecords = require("../../models/PatientRecords");


module.exports = {
    Mutation: {
        async addAppointment(
            parent,
            {
                appointmentRecordInput: {
                    appointmentWith,
                    date,
                    patientID
                },
            },
            context
        ) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName.startsWith("PAT") &&
                user.userName === patientID
            ) {

                const prevAppointments = await AppointmentModel.find({
                    "$and": [
                        { "appointmentWith": appointmentWith },
                        { 'date': date }
                    ]
                });

                if (prevAppointments.length > 10) {
                    return new UserInputError("Cannot Book More Appointments")
                }



                const appointment = new AppointmentModel({
                    date: date,
                    patientID: patientID,
                    appointmentWith: appointmentWith,
                    tokenID: date.date.toString() + date.month.toString() + date.year.toString() + patientID,
                    approved: false,
                    state: "Open",
                });

                const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Appointment Booked ${appointment._id}` });

                if (success.status === 200) {
                    const newAppointment = await appointment.save();
                    const patRecord = new PatientRecords({
                        recordID: newAppointment._id,
                        patientID: patientID,
                        typeRecord: "Appointment",
                        notified: false
                    });
                    const successOne = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Patient Record Added ${patRecord._id}` });
                    if (successOne.status === 200) {
                        const newPatRecord = await patRecord.save();
                        return newAppointment;
                    }
                    else {
                        return new UserInputError("Invalid operation");
                    }
                }

            } else {
                return new AuthenticationError("Invalid Authentivation");
            }
        },
        async setCloseAppointment(
            parent,
            { appointmentID },
            context
        ) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName.startsWith("DOC")
            ) {
                const appointmentRecord = await AppointmentModel.findOneAndUpdate(
                    {
                        "_id": appointmentID
                    },
                    { "$set": { "state": "Close" } }
                );
                const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Appointment Closed ${appointmentRecord._id}` });
                if (success.status === 200) {
                    return appointmentRecord;
                }
                else {
                    return new UserInputError("Invalid Operation");
                }
            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async setApprovedAppointment(
            parent,
            { appointmentID },
            context
        ) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName.startsWith("DOC")
            ) {
                const appointmentRecord = await AppointmentModel.findOneAndUpdate(
                    {
                        "_id": appointmentID
                    },
                    { "$set": { "approved": true } }
                );

                const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Appointment Approved ${appointmentRecord._id}` });

                if (success.status === 200) {
                    return appointmentRecord;
                }
                else {
                    return new UserInputError("Invalid Operation");
                }

            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
    },
    Query: {
        async getAppointments(parent, { appointmentWith, date }, context) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName === appointmentWith
            ) {
                const appointmentRecords = await AppointmentModel.find(
                    {
                        "$and": [
                            { "appointmentWith": appointmentWith },
                            { 'date': date }
                        ]
                    }
                );

                const finalRecords = await ProduceFinalAddedRecords(appointmentRecords, "Appointment Booked");

                return finalRecords;

            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getApprovedAppointments(parent, { appointmentWith, date }, context) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName === appointmentWith
            ) {
                const appointmentRecords = await AppointmentModel.find(
                    {
                        "$and": [
                            { "appointmentWith": appointmentWith },
                            { 'date': date },
                            { "approved": true }
                        ]
                    }
                );

                const finalRecords = await ProduceFinalAddedRecords(appointmentRecords, "Appointment Approved");

                return finalRecords;

            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getOpenAppointments(parent, { appointmentWith, date }, context) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName === appointmentWith
            ) {
                const appointmentRecords = await AppointmentModel.find(
                    {
                        "$and": [
                            { "appointmentWith": appointmentWith },
                            { 'date': date },
                            { "state": "Open" }
                        ]
                    }
                );

                const finalRecords = await ProduceFinalAddedRecords(appointmentRecords, "Appointment Booked");

                return finalRecords;

            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getUnapprovedAppointments(parent, { appointmentWith, date }, context) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName === appointmentWith
            ) {
                const appointmentRecords = await AppointmentModel.find(
                    {
                        "$and": [
                            { "appointmentWith": appointmentWith },
                            { 'date': date },
                            { "approved": false }
                        ]
                    }
                );

                const finalRecords = await ProduceFinalAddedRecords(appointmentRecords, "Appointment Booked");

                return finalRecords;

            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getClosedAppointments(parent, { appointmentWith, date }, context) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName === appointmentWith
            ) {
                const appointmentRecords = await AppointmentModel.find(
                    {
                        "$and": [
                            { "appointmentWith": appointmentWith },
                            { 'date': date },
                            { "state": "Close" }
                        ]
                    }
                );

                const finalRecords = await ProduceFinalAddedRecords(appointmentRecords, "Appointment Closed");

                return finalRecords;

            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
    },
};
