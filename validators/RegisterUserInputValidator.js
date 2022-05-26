const { AuthenticationError,UserInputError } = require("apollo-server");

module.exports = (password, confirmPassword, email)=>{
    if(!password || !confirmPassword || !email){
        return new UserInputError("Various fields are empty");
    }

    if(password !== confirmPassword){
        return new UserInputError("Please check your passwords");
    }

    if(password.length < 7){
        return new UserInputError("Password too short")
    }

    return true;
}