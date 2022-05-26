const { AuthenticationError,UserInputError } = require("apollo-server");
const checkAuth = require("../../authentication/auth");
const PatientRecords = require("../../models/PatientRecords");
const User = require("../../models/User");
const RadiologyRecords = require('../../models/RadiologyRecords');
const { default: axios } = require("axios");
const { ProduceFinalAddedRecords } = require("../../validators/FinalRecords");

module.exports = {
    Mutation: {
        async addRadioRecord(
            parent,
            {
                radioRecordInput: {
                    imageURL,
                    laboratoryID,
                    patientID,
                    date,
                    scanType,
                    bodyPart,
                    observations,
                    impressions
                },
            },
            context
        ) {
            const user = checkAuth(context);

            // user already authenticated

            if (
                user &&
                user.userName.startsWith("RAD") &&
                user.userName === laboratoryID
            ) {
                const isPatient = await User.findOne({ userName: patientID });
                if (isPatient) {
                    for (let index = 0; index < imageURL.length; index++) {
                        const element = imageURL[index];
                        imageURL[index] = process.env.PROFILE_URI + element;                        
                    }
                    
                    const newRecord = new RadiologyRecords({
                        imageURL,
                        laboratoryID,
                        patientID,
                        date,
                        scanType,
                        bodyPart,
                        observations,
                        impressions
                    });

                    const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Radiology Record Added ${newRecord._id}` });

                    if(success.status===200){
                        const record = await newRecord.save();

                        const patRecord = new PatientRecords({
                            recordID: record._id,
                            patientID: patientID,
                            typeRecord: "Radiology",
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
        async getRadioRecords(parent, data, context) {
            const user = checkAuth(context);
            if (user && user.userName.startsWith("RAD")) {
                const laboratoryID = user.userName;
                const records = await RadiologyRecords.find({ laboratoryID: laboratoryID });

                const finalRecords = await ProduceFinalAddedRecords(records, "Radiology Record Added");

                return finalRecords;

            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getPatRadioRecords(parent, { patientID }, context) {
            const user = checkAuth(context);
            if (user && (user.userName.startsWith("PAT") || user.userName.startsWith("RAD") || user.userName.startsWith("DOC"))) {
                const records = await RadiologyRecords.find({ patientID: patientID });

                const finalRecords = await ProduceFinalAddedRecords(records, "Radiology Record Added");

                return finalRecords;
            }
            else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getRadioRecord(parent, { recordID }, context) {
            const user = checkAuth(context);
            if (user && (user.userName.startsWith("PAT") || user.userName.startsWith("RAD") || user.userName.startsWith("DOC"))) {
                
                const record = await RadiologyRecords.findById(recordID)
                const success = await axios.get(process.env.BLOCKCHAIN_URI + "/getBlock", {
                    params: {
                        data: `Radiology Record Added ${record._id}`
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
