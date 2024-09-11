const express = require('express');
const User = require('../../database/model/userModel')
const {getAllClubs, getClubById, getClubMembers, joinClub} = require('../service/clubService');
const {authenticate} = require('../service/authService')

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const clubs = await getAllClubs();
        res.status(200).json(clubs);
    } catch (error) {
        console.error('Error retrieving clubs:', error.message);
        res.status(500).json({message: 'Failed to retrieve clubs'});
    }
});

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

router.get("/:clubId/members", authenticate, async (req, res) => {
    const clubId = req.params['clubId']

    try {
        const clubMembers = await getClubMembers(clubId, req.user.userId)
        res.status(200).json(clubMembers)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.post("/join/:clubId", authenticate, async (req, res, next) => {
    try {
        const clubId = req.params['clubId']
        const userId = req.user.userId

        await joinClub(clubId, userId)

        res.status(200).send(clubId)
    } catch (error) {
        res.status(500).send(error.message)
    }

})

module.exports = router;
