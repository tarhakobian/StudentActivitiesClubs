const express = require('express');
const {
    getAllClubs,
    getClubById,
    getClubMembers,
    joinClub,
    leaveClub,
} = require('../service/clubService');
const { authenticate } = require('../midldewear/securityMiddlewear');

const router = express.Router();

/**
 * @route GET /clubs
 * @desc Get all clubs
 */
router.get("/", async (req, res, next) => {
    try {
        const clubs = await getAllClubs();
        res.status(200).json(clubs);
    } catch (error) {
        next(error);
    }
});

/**
 * @route GET /clubs/:clubId
 * @desc Get club by ID
 */
router.get('/:clubId', async (req, res, next) => {
    const clubId = req.params['clubId'];

    try {
        const club = await getClubById(clubId);
        res.status(200).json(club);
    } catch (error) {
        next(error);
    }
})


/**
 * @route GET /clubs/:clubId/members
 * @desc Get all members of a specific club
 */
router.get("/:clubId/members", authenticate, async (req, res, next) => {
    const clubId = req.params['clubId'];

    try {
        const clubMembers = await getClubMembers(clubId, req.user.userId);
        res.status(200).json(clubMembers);
    } catch (error) {
        next(error);
    }
});

/**
 * @route POST /clubs/:clubId/join
 * @desc Join a specific club
 */
router.post("/:clubId/join", authenticate, async (req, res, next) => {
    try {
        const clubId = req.params['clubId'];
        const userId = req.user.userId;

        await joinClub(clubId, userId);
        res.status(200).send(clubId);
    } catch (error) {
        next(error);
    }
});

/**
 * @route PATCH /clubs/:clubId/leave
 * @desc Leave a specific club
 */
router.patch("/:clubId/leave", authenticate, async (req, res, next) => {
    try {
        const clubId = req.params['clubId'];
        const userId = req.user.userId;

        await leaveClub(clubId, userId);
        res.status(200).send("Club leave request successfully processed");
    } catch (error) {
        next(error);
    }
});

module.exports = router;