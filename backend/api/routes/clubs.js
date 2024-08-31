const express = require('express');
const Club = require('../../database/model/clubModel')
const mongoose = require("../../config/databaseConfig");

const router = express.Router();

/**Get all clubs*/
router.get("/", async (req, res, next) => {
    try {
        const clubs = await Club.find().exec();
        res.status(200).json(clubs);
    } catch (error) {
        console.error('Error retrieving clubs:', error);
        res.status(500).json({message: 'Failed to retrieve clubs'});
    }
})


module.exports = router;