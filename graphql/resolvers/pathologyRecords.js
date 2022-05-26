const { AuthenticationError, UserInputError } = require("apollo-server");
const checkAuth = require("../../authentication/auth");
const PatientRecords = require("../../models/PatientRecords");
const User = require("../../models/User");
const PathologyRecords = require("../../models/PathologyRecords");
const { default: axios } = require("axios");
const { ProduceFinalAddedRecords } = require("../../validators/FinalRecords");

module.exports = {
    Mutation: {
        async addPathoRecord(
            parent,
            {
                pathoRecordInput: {
                    laboratoryID,
                    patientID,
                    date,
                    departmentName,
                    investigations
                },
            },
            context
        ) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName.startsWith("PATH") &&
                user.userName === laboratoryID
            ) {
                const isPatient = await User.findOne({ userName: patientID });
                if (isPatient) {
                    const newRecord = new PathologyRecords({
                        laboratoryID,
                        patientID,
                        date,
                        departmentName,
                        investigations
                    });
                    const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Pathology Record Added ${newRecord._id}` });
                    if (success.status === 200) {
                        const record = await newRecord.save();
                        const patRecord = new PatientRecords({
                            recordID: record._id,
                            patientID: patientID,
                            typeRecord: "Pathology",
                            notified: false
                        });
                        const successOne = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Patient Record Added ${patRecord._id}` });

                        if (successOne.status === 200) {
                            const newPatRecord = await patRecord.save();
                            return record;
                        }
                        else {
                            return new UserInputError("Invalid operation");
                        }
                    }
                    else {
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
        async getPathoRecords(parent, data, context) {
            const user = checkAuth(context);
            if (user && user.userName.startsWith("PATH")) {
                const laboratoryID = user.userName;
                const records = await PathologyRecords.find({ laboratoryID: laboratoryID });
                const finalRecords = await ProduceFinalAddedRecords(records, "Pathology Record Added");

                return finalRecords;
            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getPatPathoRecords(parent, { patientID }, context) {
            const user = checkAuth(context);
            if (user && (user.userName.startsWith("PAT") || user.userName.startsWith("PATH") || user.userName.startsWith("DOC"))) {
                const records = await PathologyRecords.find({ patientID: patientID }); 
                const finalRecords = await ProduceFinalAddedRecords(records, "Pathology Record Added");

                return finalRecords;
            }
            else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getPathoRecord(parent, { recordID }, context) {
            const user = checkAuth(context);
            if (user && (user.userName.startsWith("PAT") || user.userName.startsWith("PATH") || user.userName.startsWith("DOC"))) {
                const record = await PathologyRecords.findById(recordID);
                const success = await axios.get(process.env.BLOCKCHAIN_URI + "/getBlock", {
                    params: {
                        data: `Pathology Record Added ${record._id}`
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
