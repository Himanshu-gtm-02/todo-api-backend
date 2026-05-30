const rateLimit = require('express-rate-limit');


const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max : 5,
    message : "Too many Requests, please try again later." 
})

module.exports = authLimiter;