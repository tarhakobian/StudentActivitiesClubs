const express = require('express');
const Club = require('../../database/model/clubModel')
const User = require('../../database/model/userModel')
const Association = require('../../database/model/associationModel')
const mongoose = require("../../config/databaseConfig");

const router = express.Router();

/**Get all clubs*/
router.get("/", async (req, res, next) => {
    try {
        let clubs = await Club.find().exec();

        clubs = clubs.map(club => {
            return {
                id: club._id,
                title: club.title,
                imageUrl: club.imageUrl
            }
        })

        res.status(200).json(clubs);
    } catch (error) {
        console.error('Error retrieving clubs:', error);
        res.status(500).json({message: 'Failed to retrieve clubs'});
    }
})

router.get('/:id', async (req, res, next) => {
    const id = req.params['id']

    let club

    try {
        club = await Club.findById(id).exec()
    } catch (e) {
        res.status(404).send(`Club with id - ${id} is not found`)
    }

    let cabinet = []

    for (let i in club.cabinet) {
        let member = club.cabinet[i]

        let user
        try {
            user = await User.findById(member.userId).exec()
        } catch (e) {
            res.status(404).send(`User with id - ${user._id} is not found`)
        }

        let association
        try {
            association = await Association.findOne({
                userId: user._id,
                clubId: club._id
            }).exec()
        } catch (e) {
            res.status(404).send(`Association with userId - ${user._id}, and clubId - ${club._id} is not found`)
        }

        member = {
            name: user.name,
            email: user.email,
            role: association.role
        }

        cabinet.push(member)
    }

    club = {
        title: club.title,
        content: club.content,
        cabinet: cabinet,
        imageUrl: club.imageUrl
    }

    res.status(200).json(club)
})


module.exports = router;