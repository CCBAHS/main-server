const { default: axios } = require("axios");

const ProduceFinalAddedRecords = async (records, recordType) => {
    finalRecords = []
    records.forEach(async (record) => {
        const success = await axios.get(process.env.BLOCKCHAIN_URI + "/getBlock", {
            params: {
                data: `${recordType} ${record._id}`
            }
        });
        if(success.status===200){
            finalRecords.push(record);
        }
    });
    return finalRecords;
}

module.exports = {ProduceFinalAddedRecords};