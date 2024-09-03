const express = require('express');
const {getAllClubs, getClubById, getClubMembers} = require('../service/clubService');

const router = express.Router();

/** Get all clubs */
router.get("/", async (req, res) => {
    try {
        const clubs = await getAllClubs();
        res.status(200).json(clubs);
    } catch (error) {
        console.error('Error retrieving clubs:', error.message);
        res.status(500).json({message: 'Failed to retrieve clubs'});
    }
});

/** Get club by ID */
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

/**Get club members*/
router.get("/:clubId/members", async (req, res) => {
    const clubId = req.params['clubId']

    try {
        const clubMembers = await getClubMembers(clubId)
        res.status(200).json(clubMembers)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router;
