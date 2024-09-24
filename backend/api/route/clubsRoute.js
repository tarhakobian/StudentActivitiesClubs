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
router.get("/", async (req, res) => {
    try {
        const clubs = await getAllClubs();
        res.status(200).json(clubs);
    } catch (error) {
        console.error('Error retrieving clubs:', error.message);
        res.status(500).json({ message: 'Failed to retrieve clubs' });
    }
});

/**
 * @route GET /clubs/:clubId
 * @desc Get club by ID
 */
router.get('/:clubId', async (req, res) => {
    const clubId = req.params['clubId'];

    try {
        const club = await getClubById(clubId);
        res.status(200).json(club);
    } catch (error) {
        console.error(`Error retrieving club with id ${clubId}:`, error.message);
        res.status(404).send(error.message);
    }
});

/**
 * @route GET /clubs/:clubId/members
 * @desc Get all members of a specific club
 */
router.get("/:clubId/members", authenticate, async (req, res) => {
    const clubId = req.params['clubId'];

    try {
        const clubMembers = await getClubMembers(clubId, req.user.userId);
        res.status(200).json(clubMembers);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * @route POST /clubs/:clubId/join
 * @desc Join a specific club
 */
router.post("/:clubId/join", authenticate, async (req, res) => {
    try {
        const clubId = req.params['clubId'];
        const userId = req.user.userId;

        await joinClub(clubId, userId);

        res.status(200).send(clubId);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @route PATCH /clubs/:clubId/leave
 * @desc Leave a specific club
 */
router.patch("/:clubId/leave", authenticate, async (req, res) => {
    try {
        const clubId = req.params['clubId'];
        const userId = req.user.userId;

        await leaveClub(clubId, userId);

        res.status(200).send("Club leave request successfully processed");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
