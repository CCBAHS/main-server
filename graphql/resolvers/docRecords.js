const { AuthenticationError,UserInputError } = require("apollo-server");
const { default: axios } = require("axios");
const { withFilter } = require("graphql-subscriptions");
const checkAuth = require("../../authentication/auth");
const DocRecords = require("../../models/DocRecords");
const PatientRecords = require("../../models/PatientRecords");
const User = require("../../models/User");
const { ProduceFinalAddedRecords } = require("../../validators/FinalRecords");

module.exports = {
    Mutation: {
        async addDocRecord(
            parent,
            {
                docRecordInput: {
                    doctorID,
                    patientID,
                    date,
                    diagnostic,
                    disease,
                    advice,
                    medicines,
                    tests,
                },
            },
            context
        ) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName.startsWith("DOC") &&
                user.userName === doctorID
            ) {
                const isPatient = await User.findOne({ userName: patientID });
                if (isPatient) {
                    const newRecord = new DocRecords({
                        doctorID,
                        patientID,
                        date,
                        diagnostic,
                        disease,
                        advice,
                        medicines,
                        tests,
                    });

                    const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Doctor Record Added ${newRecord._id}` });

                    if(success.status === 200){
                        const record = await newRecord.save();
                        const patRecord = new PatientRecords({
                            recordID: record._id,
                            patientID: patientID,
                            typeRecord: "Doctor",
                            notified: false
                        });
                        const successOne = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Patient Record Added ${patRecord._id}` });

                        if(successOne.status===200){
                            const newPatRecord = await patRecord.save();
                            return record;    
                        }
                        else{
                            return new UserInputError("Invalid operation");
                        }
                    }
                    else{
                        return new UserInputError("Invalid Operation");
                    }

                    
                } else {
                    return new UserInputError("Invalid Patient");
                }
            }
            return new AuthenticationError("Invalid Authentication");
        },
    },
    Query: {
        async getDocRecords(parent, data, { req, pubsub }) {
            const user = checkAuth(req);
            if (user && user.userName.startsWith("DOC")) {
                const doctorID = user.userName;
                const records = await DocRecords.find({ doctorID: doctorID });
                const finalRecords = await ProduceFinalAddedRecords(records, "Doctor Record Added");
                return finalRecords;

            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getPatDocRecords(parent, { patientID }, { req, pubsub }) {
            const user = checkAuth(req);
            if (user && (user.userName.startsWith("PAT") || user.userName.startsWith("DOC"))) {
                const records = await DocRecords.find({ patientID: patientID });
                const finalRecords = await ProduceFinalAddedRecords(records, "Doctor Record Added");
                return finalRecords;
            }
            else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getDocRecord(parent, { recordID }, { req, pubsub }) {
            const user = checkAuth(req);
            if (user && (user.userName.startsWith("PAT") || user.userName.startsWith("DOC"))) {
                const record = await DocRecords.findById(recordID);
                const success = await axios.get(process.env.BLOCKCHAIN_URI + "/getBlock", {
                    params: {
                        data: `Doctor Record Added ${record._id}`
                    }
                });
                if(success.status===200){
                    return record;
                }
                else{
                    return new UserInputError("Invalid operation");
                }
            }
            else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
    },
};
