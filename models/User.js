const {model, Schema} = require('mongoose');

const UserSchema = new Schema({
    userName: {
        type: String,
        unique: [true, "Username already exists"],
        required: [true, "Please provide a username"],
    },
    name:{
        firstName:{
            type: String,
            required:[true, "Please provide a first name"]
        },
        middleName:{
            type: String,
            required:[true, "Please provide a middle name"]
        },
        lastName:{
            type: String,
            required:[true, "Please provide a last name"]
        }
    },
    title:{
        type: String,
        required: [true, "Please provide a title"],
        enum: ["Doctor", "Patient", "Pathology", "Radiology", "Pharmacy"], 
    },
    address:{
        houseName:{
            type: String,
            required: [true, "Please provide the house name"],
        },
        street:{
            type: String,
            required: [true, "Please provide the street"],
        },
        city:{
            type: String,
            required: [true, "Please provide the city"],
        },
        state:{
            type: String,
            required: [true, "Please provide the state"],
        },
        country:{
            type: String,
            required: [true, "Please provide the country"],
        },
        pincode:{
            type: Number,
            required: [true, "Please provide the pincode"],
            max: 999999,
            min: 110000,
        },
    },
    contactDetails:{
        number:{
            type: Number,
            required: [true, "Please provide the number"],
            max: 9999999999,
            min: 5000000000,
        },
        countryCode:{
            type: Number,
            required: [true, "Please provide the country code"]
        },
    },
    adhaarNumber:{
        type: Number,
        required: [true, "Please provide the adhaar number"],
        unique: [true, "Adhaar already exists"],
        max: 999999999999,
        min: 000000000000,
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
    },
    gender: {
        type: String,
        required: [true, "Please provide gender"],
        enum: ["male", "female", "others"],
    },
    dob: {
        date:{
            type: Number,
            max: [31, "Please provide a valid date"],
            min: [1, "Please provid a valid date"],
        },
        month:{
            type: Number,
            max: [12, "Please provide a valid month"],
            min: [1, "Please provid a valid month"],
        },
        year:{
            type: Number,
        },
    },
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email address']
    },
    profileImage:{
        type: String,
        required: [true, "Please provide profile image"],
    }
},{
    timestamps: true,
});


module.exports = new model('User', UserSchema);