const logger = require('../utils/logger');

const loggermiddleware = (req,res,next)=>{
    const start = Date.now();

        res.on("finish",() => {
            const duration = Date.now() - start;
            console.log(res.statusCode);

            logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
        })
     

    next();
}
module.exports = loggermiddleware;