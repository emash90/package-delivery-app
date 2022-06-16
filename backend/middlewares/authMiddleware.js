const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            //get the token
            token = req.headers.authorization.split(" ")[1];

            //verify the token

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            //get user from the token

            req.user = await User.findById(decodedToken.id).select("-password");

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Not authorised");
            
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorised, no token!");
    }
});

module.exports = protect;
