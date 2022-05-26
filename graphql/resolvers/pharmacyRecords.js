const { AuthenticationError, UserInputError } = require("apollo-server");
const checkAuth = require("../../authentication/auth");
const PatientRecords = require("../../models/PatientRecords");
const User = require("../../models/User");
const PharmacyRecords = require("../../models/PharmacyRecords");
const { default: axios } = require("axios");
const { ProduceFinalAddedRecords } = require("../../validators/FinalRecords");

module.exports = {
    Mutation: {
        async addPharmaRecord(
            parent,
            {
                pharmaRecordInput: {
                    pharmacyID,
                    date,
                    medicine,
                    pharmaStockType,
                    expiryDate,
                    patientID
                },
            },
            context
        ) {
            const user = checkAuth(context);
            if (
                user &&
                user.userName.startsWith("PHA") &&
                user.userName === pharmacyID
            ) {


                const newRecord = new PharmacyRecords({
                    pharmacyID,
                    date,
                    medicine,
                    pharmaStockType,
                    expiryDate,
                    patientID
                });

                const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Pharmacy Record Added ${newRecord._id}` });

                if (success.status === 200) {
                    const record = await newRecord.save();
                    if (pharmaStockType === "Pharmacy-Dispatch") {
                        const isPatient = await User.findOne({ userName: patientID });
                        if (isPatient) {
                            const patRecord = new PatientRecords({
                                recordID: record._id,
                                patientID: patientID,
                                typeRecord: "Pharmacy-Dispatch",
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
                        else{
                            return new UserInputError("Invalid Patient");
                        }

                    }
                    else {
                        return record;
                    }
                }
                else {
                    return new UserInputError("Invalid operation");
                }

            }
            else{
                return new AuthenticationError("Invalid Authentication");
            }
        },
    },
    Query: {
        async getPharmaRecords(parent, data, context) {
            const user = checkAuth(context);
            if (user && user.userName.startsWith("PHA")) {
                const pharmacyID = user.userName;
                const records = await PharmacyRecords.find({ pharmacyID: pharmacyID });
                const finalRecords = await ProduceFinalAddedRecords(records, "Pharmacy Record Added");

                return finalRecords;
            } else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getPatPharmaRecords(parent, { patientID }, context) {
            const user = checkAuth(context);
            if (user && (user.userName.startsWith("PAT") || user.userName.startsWith("PHA") || user.userName.startsWith("DOC"))) {
                const records = await PatientRecords.find({ patientID: patientID });
                let finalRecords = [];
                records.forEach(async (record) => {
                    const tempRecord = await PharmacyRecords.findById(record.recordID);
                    const success = await axios.get(process.env.BLOCKCHAIN_URI + "/getBlock", {
                        params: {
                            data: `Pharmacy Record Added ${tempRecord._id}`
                        }
                    });
                    if (success.status === 200) {
                        finalRecords.push(tempRecord);
                    }
                    else {
                        return new UserInputError("Invalid operation");
                    }
                });

                return finalRecords;
            }
            else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
        async getPharmaRecord(parent, { recordID }, context) {
            const user = checkAuth(context);
            if (user && (user.userName.startsWith("PAT") || user.userName.startsWith("PHA") || user.userName.startsWith("DOC"))) {
                const record = await PharmacyRecords.findById(recordID);

                const success = await axios.get(process.env.BLOCKCHAIN_URI + "/getBlock", {
                    params: {
                        data: `Pharmacy Record Added ${record._id}`
                    }
                });

                if (success.status === 200) {
                    return record;
                }
                else {
                    return new UserInputError("Invalid operation");
                }
            }
            else {
                return new AuthenticationError("Invalid Authentication");
            }
        },
    },
};
