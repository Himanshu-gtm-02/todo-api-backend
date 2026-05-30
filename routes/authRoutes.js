
const express = require('express');
const {registerUser,loginUser, refreshAccessToken, logout} = require('../controllers/authController')

const { body } = require('express-validator');
const validate = require('../validators/authValidator')
const protect = require('../middlewares/authMidlleware');

const authLimiter = require('../middlewares/authLimiter');


const router = express.Router();

router.post('/register', authLimiter, 

  body("email")
  .notEmpty()
  .withMessage("Email is required..")
  .bail()
  .isEmail()
  .withMessage("Please enter valid email.."),


  body("password")
  .notEmpty()
  .withMessage("Password is required..")
  .bail()
  .isLength({min : 6})
  .withMessage("Password must be at least 6 characters"),



  body("name")
  .notEmpty()
  .withMessage("Name is required.."),


  validate,
  registerUser
);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

router.post('/login',authLimiter, loginUser);


//refresh endpoint
/**
 * @swagger
 * /api/auth/refresh:
 *    post:
 *      summary: Generate new access token using refresh token cookie
 *      tags: [Auth]
 *      responses:
 *          200: 
 *              description: New access token generated
 *          401:
 *              description: refresh token invalid or missing
 */


router.post('/refresh', authLimiter, refreshAccessToken);


//logout

/**
 * @swagger
 * /api/auth/logout:
 *      post:
 *        summary: logout user
 *        tags: [Auth]
 *        security: 
 *             -bearerAuth: []
 *        responses:
 *            200:
 *                description: Logout successful
 *            401: 
 *                description: Unauthorized
 */

router.post('/logout',protect, logout);


module.exports = router;