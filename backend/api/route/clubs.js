const express = require('express');
const {getAllClubs, getClubById} = require('../service/clubService');

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
router.get('/:id', async (req, res) => {
    const id = req.params['id'];
    try {
        const club = await getClubById(id);
        res.status(200).json(club);
    } catch (error) {
        console.error(`Error retrieving club with id ${id}:`, error.message);
        res.status(404).send(error.message);
    }
});

module.exports = router;
