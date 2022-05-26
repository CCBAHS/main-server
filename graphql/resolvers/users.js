const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const RegisterUserInputValidator = require('../../validators/RegisterUserInputValidator');
const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken');
const LoginUserInputValidator = require('../../validators/LoginUserInputValidator');
const { UserInputError } = require("apollo-server");
const { sendCustomMail } = require('../../mail/Mailer');
const { resetPasswordHTML, welcomeTextHTML } = require('../../mail/TextMailHTML');
const { default: axios } = require('axios');

require('dotenv').config();

const generateOTP = () => {
    const string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let OTP = '';
    const len = string.length;
    for (let i = 0; i < 6; i++) {
        OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
}

const generateToken = (user) => {
    return jsonwebtoken.sign({
        _id: user._id,
        adhaarNumber: user.adhaarNumber,
        userName: user.userName,
        profileImage: user.profileImage
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
};

const generateUserName = (title, year, state) => {
    const statecodes = require('../../statecodes.json');
    var userCounter;
    if (!fs.existsSync('counter.txt')) {
        userCounter = 0;
    }
    else {
        userCounter = fs.readFileSync('counter.txt', 'utf8');
    }
    state = state.toLowerCase();
    let prefix;
    if (title === "Pathology") {
        prefix = "PATH";
    }
    else {
        prefix = title.substring(0, 3).toUpperCase();
    }
    const userName = prefix + statecodes[state] + year + userCounter;
    fs.writeFileSync('counter.txt', (parseInt(userCounter) + 1).toString())
    return userName;
};

module.exports = {
    Mutation: {
        async register(parent, { registerInput: {
            title,
            email,
            password,
            confirmPassword,
            dob,
            gender,
            name,
            address,
            mobileNumber,
            adhaarNumber,
            profileImage
        } }) {
            if (RegisterUserInputValidator(password, confirmPassword, email)) {
                let userName = generateUserName(title, dob.year, address.state);
                const hashedPassword = await bcrypt.hash(password, 12);
                gender = gender.toLowerCase();
                mobileNumber.number = parseInt(mobileNumber.number);
                address.pincode = parseInt(address.pincode);
                adhaarNumber = parseInt(adhaarNumber);
                const newUser = User({
                    userName: userName,
                    name: name,
                    title: title,
                    address: address,
                    contactDetails: mobileNumber,
                    adhaarNumber: adhaarNumber,
                    password: hashedPassword,
                    gender: gender,
                    dob: dob,
                    email: email,
                    profileImage: process.env.PROFILE_URI + profileImage
                });

                const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `User Registered ${newUser._id}` });

                if (success.status === 200) {
                    const res = await newUser.save();
                    const user = {
                        _id: res._id,
                        adhaarNumber,
                        userName,
                        profileImage
                    }
                    const token = generateToken(user);

                    sendCustomMail(email, "Welcome to Blockchain Tele-Health Services", welcomeTextHTML(name, userName))

                    return {
                        token,
                        userName
                    };
                }
                else {
                    return new AuthenticationError("Invalid Operation");
                }

            }
        },
        async login(parent, { userName, password }) {
            if (LoginUserInputValidator(userName, password)) {
                const currUser = await User.findOne({ userName });

                const prevSuccess = await axios.get(process.env.BLOCKCHAIN_URI + "/getBlock", {
                    params: {
                        data: `User Registered ${currUser._id}`
                    }
                });

                if (prevSuccess.status === 200) {
                    const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `User Logged In ${currUser._id}` });

                    if (success.status === 200) {
                        const match = await bcrypt.compare(password, currUser.password);
                        if (!currUser || !match) {
                            return new UserInputError("Provide Valid Credentials");
                        }
                        const user = {
                            _id: currUser._id,
                            adhaarNumber: currUser.adhaarNumber,
                            userName,
                            profileImage: currUser.profileImage
                        }
                        const token = generateToken(user);
                        return {
                            token,
                            userName
                        };
                    }
                    else {
                        return new AuthenticationError("Invalid Operation");
                    }
                }
                else{
                    return new AuthenticationError("Invalid Operation");
                }


            }
        },
        async resetPassword(parent, { userID, OTP, password, confirmPassword }, context) {
            if (OTP) {
                if (password === confirmPassword) {
                    const hashedPassword = await bcrypt.hash(password, 12);
                    const user = await User.findOneAndUpdate({ userName: userID }, { password: hashedPassword });
                    const success = await axios.post(process.env.BLOCKCHAIN_URI + "/addBlock", { data: `User Password Reset ${user._id}` });
                    if (success.status === 200) {
                        return "Updated successfully";
                    }
                    else {
                        return new AuthenticationError("Invalid Operation");
                    }
                }
                else {
                    return new UserInputError("Check your Passwords");
                }
            }
            else {
                return new UserInputError("Invalid OTP");
            }
        }
    },
    Query: {
        async sendOTP(parent, { email }, context) {
            const OTP = generateOTP();

            sendCustomMail(email, "One Time Password to reset your password", resetPasswordHTML(OTP));

            return OTP;
        },
    },
}