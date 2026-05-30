const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')


const protect = asyncHandler(async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    )
    req.user = decoded;
    next();

})

module.exports = protect;