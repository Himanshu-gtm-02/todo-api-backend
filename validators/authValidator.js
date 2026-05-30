const { validationResult }= require('express-validator')

const validate = (req,res,next) => {
   const errors = validationResult(req);

    const formattedArray = errors.array().map(
        (err) => err.msg
    )

   if(!errors.isEmpty()){
      return res.status(400).json({
         errors: formattedArray
      });
   }

   next();
}
module.exports = validate;