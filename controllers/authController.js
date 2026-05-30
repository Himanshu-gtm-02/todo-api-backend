const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler')
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const generateRefreshToken = require('../utils/generateRefreshToken')


const registerUser = asyncHandler(async (req,res) => {
    const {name , email , password}  = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            message : "User already exist"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const user = new User({
        name,
        email,
        password : hashedPassword
    });
    await user.save();
    return res.status(201).json({
        message : "User created successfully.",
        user : {
            id : user._id,
            name: user.name,
            email : user.email,
        }
    })
})


const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message : "Enter email and password.."
        })
    }
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return res.status(404).json({
            message : "user not found."
        })
    }
    const isMatch = await bcrypt.compare(
        password,
        existingUser.password
    )

    if(!isMatch){
        return res.status(401).json({
            message : "Invalid credentials."
        })
    }

    //putting token generation 
    const accessToken = generateToken(existingUser._id);
    const refreshToken = generateRefreshToken(existingUser._id);

    //save refreshToken in DB
    existingUser.refreshToken = refreshToken;

    await existingUser.save();

    //set HttpOnly cookie
    res.cookie("refreshToken",refreshToken,{
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge : 7*24*60*60*1000
    })

    //saving the refreshToken inside the User document (DB).
  
    

    return res.status(200).json({
        success : true,
        message : "Login Successfull",
        accessToken,
        user : {
            id : existingUser._id,
            email : existingUser.email
        }
    })
    
})

const refreshAccessToken = asyncHandler(async (req,res) => {
    // const {refreshToken} = req.body;
    
    //now we fetch that refreshToken from HTTP-only cookie

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message : "Request Denied, Refresh Token not found."
        });
    }

    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET
    );

    //we created a new access token here. if we hit /refresh endpoint then we get new access token.
    const newAccessToken = generateToken(decoded.id);
    return res.status(200).json({
        accessToken : newAccessToken
    })
})

const logout = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user.id);
    user.refreshToken = "" || null;
    await user.save();
    res.clearCookie("refreshToken");
    return res.status(200).json({
        message : "Logout successfully"
    })
})


module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logout
}

