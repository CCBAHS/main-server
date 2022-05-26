require('dotenv').config();
const { AuthenticationError } = require("apollo-server-errors");

const jwt = require('jsonwebtoken');

module.exports = (context)=>{
    // context = {..., header, ....}

    console.log(context.req);

    const authHeader = context.req.headers.authorization;

    if(authHeader){
        // Bearer ....
        const token = authHeader.split('Bearer ')[1];

        if(token){
            try{
                const user = jwt.verify(token, process.env.JWT_SECRET);
                if(user){
                    return user;
                }
                throw new AuthenticationError("Invalid Authentication");
            }
            catch(error){
                throw new AuthenticationError(error);
            }
        }
        throw new AuthenticationError("Invalid Authentication");
    }
    throw new AuthenticationError("Invalid Authentication");
}