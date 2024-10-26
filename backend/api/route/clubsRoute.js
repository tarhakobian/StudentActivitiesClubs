const express = require('express');
const clubService = require('../service/clubService');
const { authenticate } = require('../middlewear/securityMiddlewear');
const { BadRequestError } = require('../errors/errors');

const router = express.Router();

/**
 * @swagger
 *  paths:
 *    /clubs/:
 *      get:
 *        tags:
 *          - Clubs
 *        summary: Retrieve all clubs
 *        description: This endpoint returns a list of all clubs in the system.
 *        responses:
 *          200:
 *            description: A JSON array of all clubs
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: The unique identifier of the club
 *                      title:
 *                        type: string
 *                        description: The name of the club
 *                      imageUrl:
 *                        type: string
 *                        description: The club's logo
 *          500:
 *            description: Internal server error
 */
router.get("/", async (req, res, next) => {
    try {
        const clubs = await clubService.getAllClubs();
        res.status(200).json(clubs);
    } catch (error) {
        next(error);
    }
});


/** 
 * @swagger
 *  paths:
 *    /clubs/{clubId}:
 *      get:
 *        tags:
 *          - Clubs
 *        summary: Retrieve a club by its ID
 *        description: This endpoint returns the details of a club based on the provided club ID.
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The unique identifier of the club
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: A JSON object representing the club
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    clubId:
 *                      type: string
 *                      description: The unique identifier for the club
 *                    title:
 *                      type: string
 *                      description: The title of the club
 *                    content:
 *                      type: string
 *                      description: The content or description of the club
 *                    cabinet:
 *                      type: array
 *                      description: List of cabinet members in the club
 *                      items:
 *                        type: object
 *                        properties:
 *                          name:
 *                            type: string
 *                            description: The name of the cabinet member
 *                          email:
 *                            type: string
 *                            description: The email of the cabinet member
 *                          role:
 *                            type: string
 *                            description: The role of the cabinet member in the club
 *                    imageUrl:
 *                      type: string
 *                      description: URL of the club's image
 *          404:
 *            description: Club not found
 *          500:
 *            description: Internal server error
 */
router.get('/:clubId', async (req, res, next) => {
    const clubId = req.params['clubId'];

    try {
        const club = await clubService.getClubById(clubId);
        res.status(200).json(club);
    } catch (error) {
        next(error);
    }
})

/**
 * @swagger
 *  paths:
 *    /clubs/search/{regex}:
 *      get:
 *        tags:
 *          - Clubs
 *        summary: Search clubs by regular expression
 *        description: This endpoint allows searching for clubs using a regular expression.
 *        parameters:
 *          - in: path
 *            name: regex
 *            required: true
 *            description: The regular expression to match against club names or descriptions.
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: A list of clubs matching the search pattern
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: The unique identifier of the club
 *                      title:
 *                        type: string
 *                        description: The name of the club
 *                      imageUrl:
 *                        type: string
 *                        description: The club's logo
 *          400:
 *            description: Input required
 *          500:
 *            description: Internal server error
 */
router.get('/search/:regex', async (req, res, next) => {
    try {
        const regex = req.params['regex'];

        if (!regex) {
            throw new BadRequestError('Input required')
        }

        const clubs = await clubService.searchClubs(regex);
        res.status(200).json(clubs);
    } catch (err) {
        next(err)
    }
})

/**
 * @swagger
 *  paths:
 *    /clubs/{clubId}/members:
 *      get:
 *        tags:
 *          - Clubs
 *        summary: Get all members of a specific club
 *        description: This endpoint returns a list of all members of the specified club.
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The unique identifier of the club
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: A list of members belonging to the club
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      userId:
 *                        type: string
 *                        description: The unique identifier of the club member
 *                      name:
 *                        type: string
 *                        description: The name of the club member
 *          500:
 *            description: Internal server error
 */
router.get("/:clubId/members", authenticate, async (req, res, next) => {
    const clubId = req.params['clubId'];

    try {
        const clubMembers = await clubService.getClubMembers(clubId, req.user.userId);
        res.status(200).json(clubMembers);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 *  paths:
 *    /clubs/{clubId}/join:
 *      post:
 *        tags:
 *          - Clubs
 *        summary: Join a specific club
 *        description: This endpoint allows a user to join a specific club.
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The unique identifier of the club
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: The ID of the club that was joined
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 *                  description: The unique identifier of the joined club
 *          400: 
 *            description: User is already a member of this club
 *          401:
 *            description: Access denied - No token provided
 *          500:
 *            description: Internal server error
 */
router.post("/:clubId/join", authenticate, async (req, res, next) => {
    try {
        const clubId = req.params['clubId'];
        const userId = req.user.userId;

        await clubService.joinClub(clubId, userId);
        res.status(200).send(clubId);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 *  paths:
 *    /clubs/{clubId}/leave:
 *      delete:
 *        tags:
 *          - Clubs
 *        summary: Leave a specific club
 *        description: This endpoint allows a user to leave a specific club.
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The unique identifier of the club
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 *                  description: The unique identifier of the left club
 *            description: Successfully left the club
 *          403: 
 *            description: Only users with role Member can leave the club || Unauthorized request
 *          404: 
 *            description: User or Club is not found
 *          500:
 *            description: Internal server error
 */
router.delete("/:clubId/leave", authenticate, async (req, res, next) => {
    try {
        const clubId = req.params['clubId'];
        const userId = req.user.userId;

        await clubService.leaveClub(clubId, userId);
        res.status(200).send(clubId);
    } catch (error) {
        next(error);
    }
});

router.post("/:clubId/submitApplication", authenticate, async (req, res, next) => {
    try {
        const clubId = req.params['clubId'];
        const userId = req.user.userId;
        const { answers } = req.body; // Expecting answers to be submitted

        await clubService.submitApplication(clubId, userId, answers);

        res.status(200).send({ message: 'Successfully joined the club' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;