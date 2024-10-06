const express = require('express');
const { register, login, getUserProfileData } = require('../service/userService');
const { authenticate } = require("../middlewear/securityMiddlewear");
const { BadRequestError } = require('../errors/errors');

const router = express.Router();

/**
 * @swagger
 *  paths:
 *    /users/register:
 *      post:
 *        tags:
 *          - Users
 *        summary: User registration
 *        description: This endpoint allows users to register by providing their email, password, and name.
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                    description: The email of the user
 *                  password:
 *                    type: string
 *                    description: The password for the user account
 *                  name:
 *                    type: string
 *                    description: The name of the user
 *                example:
 *                    email: JohnSmith@student.glendale.edu
 *                    password: "123456"
 *                    name: John Smith
 *                required:
 *                  - email
 *                  - password
 *                  - name
 *        responses:
 *          201:
 *            description: User registered successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 *                  description: The unique ID (UUID) of the newly registered user
 *          400:
 *            description: Bad request - Invalid input data
 *          500:
 *            description: Internal server error
 */
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        const userId = await register(email, password, name);

        res.status(201).send(userId);
    } catch (error) {
        next(error)
    }
});

/**
 * @swagger
 *  paths:
 *    /users/login:
 *      post:
 *        tags:
 *          - Users
 *        summary: User login
 *        description: This endpoint allows users to log in by providing their email and password.
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                    description: The email of the user
 *                  password:
 *                    type: string
 *                    description: The password for the user account
 *                example:
 *                    email: JohnSmith@student.glendale.edu
 *                    password: "123456"  
 *                required:
 *                  - email
 *                  - password
 *        responses:
 *          200:
 *            description: User logged in successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                      description: The JWT token for the logged-in user
 *          401:
 *            description: Unauthorized - Invalid email or password
 *          500:
 *            description: Internal server error
 */
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const token = await login(email, password);

        res.status(200).json({ token });
    } catch (error) {
        next(error)
    }
});

/**
 * @swagger
 *  paths:
 *    /users/info/{userId}:
 *      get:
 *        tags:
 *          - Users
 *        summary: Get user profile information
 *        description: This endpoint allows authenticated users to retrieve the profile data of a specific user by their user ID.
 *        security:
 *          - bearerAuth: [] 
 *        parameters:
 *          - in: path
 *            name: userId
 *            required: true
 *            description: The unique identifier of the user whose profile data is being requested
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: User profile data retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: The ID of the user
 *                    name:
 *                      type: string
 *                      description: The name of the user
 *                    email:
 *                      type: string
 *                      description: The email of the user
 *                    otherData:
 *                      type: object
 *                      description: Additional profile data related to the user
 *          404:
 *            description: User not found - The specified user ID does not exist
 *          401:
 *            description: Unauthorized - The user is not authenticated
 *          500:
 *            description: Internal server error
 */
router.get('/info/:userId', authenticate, async (req, res, next) => {
    try {
        const targetUserId = req.params['userId'];
        const userId = req.user.userId;
        
        const targetUserData = await getUserProfileData(userId, targetUserId);
        res.status(200).json(targetUserData);
    } catch (error) {
        next(error)
    }
});




module.exports = router;
