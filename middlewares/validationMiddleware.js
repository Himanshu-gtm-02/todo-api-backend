

const noteValidatorMiddleware = (req,res,next) => {
    if(!req.body.title || !req.body.title.trim()){
        return res.status(404).json({
            message : "Title is required..Please Enter Valid title."
        })
    }
    next();
}
module.exports = noteValidatorMiddleware;