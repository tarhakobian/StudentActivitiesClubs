const express = require('express');

const {
    createAnnouncement,
    deleteAnnouncement,
    editAnnouncement,
    getAllAnnouncements, announcementsChangeActiveStatus
} = require('../service/announcementService')

const { authenticate } = require('../midlewear/securityMidlwear')

const router = express.Router();

router.get('/announcements/:clubId', authenticate, async (req, res, next) => {
    const userId = req.user.userId
    const clubId = req.params['clubId']

    const announcements = await getAllAnnouncements(clubId, userId);

    res.status(200).json(announcements)
})

router.post('/announcements/:clubId', authenticate, async (req, res) => {
    try {
        const { title, content, attachments } = req.body
        
        const userId = req.user.userId
        const clubId = req.params['clubId']

        if (!title || !content || !clubId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const announcementDetails = {
            title: title, content: content, authorId: userId, clubId: clubId, attachments: attachments || [],
        };

        const announcementId = await createAnnouncement(announcementDetails);

        res.status(201).json({
            message: 'Announcement created successfully', announcement: announcementId,
        });
    } catch (err) {
        console.error('Error creating announcement:', err);
        res.status(500).json({ message: 'Internal server error' });
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

router.put('/announcements/:announcementId', authenticate, async (req, res) => {
    const announcementId = req.params['announcementId'];
    const userId = req.user.userId;
    const body = req.body;

    try {

        if (!body.title && !body.content && !body.attachments) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const announcement = await editAnnouncement(userId, announcementId, body)
        return res.status(200).json({ message: "Announcement updated successfully", announcement });
    } catch (error) {
        return res.status(500).json({ error: `Error updating announcement: ${error.message}` });
    }
});

router.patch('/announcements/changeActiveStatus/:announcementId', authenticate, async (req, res) => {
    const announcementId = req.params['announcementId'];
    const userId = req.user.userId;

    try {
        await announcementsChangeActiveStatus(announcementId, userId);
    } catch (e) {
        res.status(500).send(e.message)
    }

    res.status(200)
});

module.exports = router