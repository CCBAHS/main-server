const { AuthenticationError,UserInputError } = require("apollo-server");
const { default: axios } = require("axios");
const checkAuth = require("../../authentication/auth");
const PatientRecords = require("../../models/PatientRecords");
const { ProduceFinalAddedRecords } = require("../../validators/FinalRecords");

module.exports = {
    Mutation: {
        async setNotifiedRecord(parent, {recordID, patientID}, context){
            const user = checkAuth(context);
            if (user) {                
                if(user.userName.startsWith("PAT") && user.userName===patientID){
                    const record = await PatientRecords.findByIdAndUpdate(recordID, {notified:true});
                    const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `Patient Notified ${record._id}` });                
                    
                    if(success.status === 200){
                        return "Notified";
                    }
                    else{
                        return new UserInputError("Invalid Operation");
                    }
                }
                else{
                    return new UserInputError("Invalid Operations");
                }
            } else {
                return new AuthenticationError("Invalid Authentication");
            }            
        },        
    },
    Query:{
        async getPatRecords(parent, {patientID}, context){
            const user = checkAuth(context);
            if (user) {                
                if(user.userName.startsWith("PAT") && user.userName===patientID){
                    const records = await PatientRecords.find({patientID:patientID});              
                    const finalRecords = await ProduceFinalAddedRecords(records, "Patient Record Added");      
                    return finalRecords;
                }
                else{
                    return new UserInputError("Invalid Operations");
                }
            } else {
                return new AuthenticationError("Invalid Authentication");
            }  
        }
    },
}