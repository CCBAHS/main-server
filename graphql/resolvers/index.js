const userResolvers = require('./users');
const docRecordResolvers = require("./docRecords");
const patRecordResolvers = require('./patientRecords');
const radioRecordResolvers = require('./radioRecords');
const pathoRecordResolvers = require('./pathologyRecords');
const appointmentRecordResolvers = require('./appointmentRecords');
const pharmaRecordResolvers = require('./pharmacyRecords');

module.exports = {
    Query:{
        ...userResolvers.Query,
        ...docRecordResolvers.Query,
        ...patRecordResolvers.Query,
        ...radioRecordResolvers.Query,
        ...pathoRecordResolvers.Query,
        ...appointmentRecordResolvers.Query,
        ...pharmaRecordResolvers.Query,
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...docRecordResolvers.Mutation,
        ...patRecordResolvers.Mutation,
        ...radioRecordResolvers.Mutation,
        ...pathoRecordResolvers.Mutation,
        ...appointmentRecordResolvers.Mutation,
        ...pharmaRecordResolvers.Mutation,
    },
    // Subscription:{
        // ...docRecordResolvers.Subcription,
    // },
}