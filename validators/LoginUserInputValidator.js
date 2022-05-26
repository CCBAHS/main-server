const { AuthenticationError,UserInputError } = require("apollo-server");

module.exports = (username, password)=>{
    if(!username || !password){
        return new UserInputError("Various fields are empty");
    }

    return true;
}