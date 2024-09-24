const express = require('express');
const { createMeeting, deleteMeeting, getAllMeetings, getMeetingById, toggleMeetingActive, updateMeeting } = require('../service/meetingService')
const { authenticate } = require('../midlewear/securityMidlwear');

const router = express.Router();

/**
 * @route POST /meetings/:clubId
 * @desc Create a new meeting for a specific club
 */
router.post('/:clubId', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId
        const clubId = req.params['clubId'];

        const meeting = await createMeeting(clubId, userId, req.body);
        return res.status(201).json(meeting);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

/**
 * @route GET /meetings/:clubId
 * @desc Get all meetings for a specific club
 */
router.get('/:clubId', authenticate, async (req, res) => {
    try {
        const clubId = req.params['clubId'];
        const userId = req.user.userId;

        const meetings = await getAllMeetings(clubId, userId);

        return res.status(200).json(meetings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * @route PUT /meetings/:meetingId
 * @desc Update a specific meeting by ID
 */
router.put('/:meetingId', authenticate, async (req, res) => {
    try {
        const meeting = await updateMeeting(req.params.meetingId, req.body);
        return res.json(meeting);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
});

/**
 * @route DELETE /meetings/:meetingId
 * @desc Delete a specific meeting by ID
 */
router.delete('/:meetingId', authenticate, async (req, res) => {
    try {
        const meeting = await deleteMeeting(req.params.meetingId);
        return res.json({ message: "Meeting deleted successfully", meeting });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
});

module.exports = router;
