const express = require('express');
const {
    getAllClubs,
    getClubById,
    getClubMembers,
    joinClub,
    createAnnouncement,
    deleteAnnouncement, editAnnouncement, getAllAnnouncements, leaveClub
} = require('../service/clubService');

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
router.patch("/leave/:clubId", authenticate, async (req, res, next) => {
    try {
        const clubId = req.params['clubId']
        const userId = req.user.userId

        await leaveClub(clubId, userId)

        res.status(200).send("Club leave request successfully processed")
    } catch (error) {
        res.status(500).send(error.message)
    }

})


router.get('/announcements/:clubId', authenticate, async (req, res, next) => {
    const userId = req.user.userId
    const clubId = req.params['clubId']

    const announcements = await getAllAnnouncements(clubId, userId);

    res.status(200).json(announcements)
})

router.post('/announcements', authenticate, async (req, res) => {
    try {
        const {title, content, clubId, attachments} = req.body;
        const userId = req.user.userId

        if (!title || !content || !clubId) {
            return res.status(400).json({message: 'Missing required fields'});
        }

        const announcementDetails = {
            title: title,
            content: content,
            authorId: userId,
            clubId: clubId,
            attachments: attachments || [],
        };

        const announcementId = await createAnnouncement(announcementDetails);

        res.status(201).json({
            message: 'Announcement created successfully',
            announcement: announcementId,
        });
    } catch (err) {
        console.error('Error creating announcement:', err);
        res.status(500).json({message: 'Internal server error'});
    }
});

router.delete('/announcements/:announcementId', authenticate, async (req, res, next) => {
    const announcementId = req.params['announcementId']
    const userId = req.user.userId

    if (!announcementId) {
        res.status(400).send('Missing announcementId')
    }

    try {
        await deleteAnnouncement(announcementId, userId)
    } catch (error) {
        res.status(500).send("Internal server error")
    }

    res.status(200).send("Successfully deleted")
})
router.put('/announcements/:announcementId', async (req, res) => {
    const announcementId = req.params['announcementId'];
    const userId = req.userId;
    const body = req.body;

    try {

        if (!body.title && !body.content && !body.attachments) {
            return res.status(400).json({error: "No fields to update"});
        }

        const announcement = await editAnnouncement(userId, announcementId, body)
        return res.json({message: "Announcement updated successfully", announcement});
    } catch (error) {
        return res.status(500).json({error: `Error updating announcement: ${error.message}`});
    }
});


module.exports = router;
