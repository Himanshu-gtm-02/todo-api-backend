
//adding notFound middleware
const notFound = (req,res,next)=>{
    const error = new Error(
        `Route not found ${req.originalUrl}`
    );
    res.status(404);
    next(error);
}




const errorMiddleware= (err,req,res,next) => {
    res.status(err.status || 500).json({
        message : err.message || "server error"
    })
}

module.exports = {
    errorMiddleware,
    notFound
};