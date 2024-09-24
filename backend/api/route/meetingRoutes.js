const express = require('express');
const { createMeeting, deleteMeeting, getAllMeetings, getMeetingById, toggleMeetingActive, updateMeeting } = require('../service/meetingService');
const { authenticate } = require('../midldewear/securityMiddlewear');

const router = express.Router();

/**
 * @route POST /meetings/:clubId
 * @desc Create a new meeting for a specific club
 */
router.post('/:clubId', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
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
 * @route GET /meetings/:clubId/:meetingId
 * @desc Get a specific meeting by its ID for a specific club
 */
router.get('/:clubId/:meetingId', authenticate, async (req, res) => {
    const { clubId, meetingId } = req.params;
    const userId = req.user.userId;

    try {
        const meeting = await getMeetingById(clubId, meetingId, userId);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found or inactive' });
        }
        res.status(200).json(meeting);
    } catch (error) {
        console.error('Error fetching meeting:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route PUT /meetings/:meetingId
 * @desc Update a specific meeting by its ID
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
 * @route DELETE /meetings/:clubId/:meetingId
 * @desc Delete a specific meeting by its ID for a specific club
 */
router.delete('/:clubId/:meetingId', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const clubId = req.params['clubId'];
        const meetingId = req.params['meetingId'];

        const meeting = await deleteMeeting(clubId, meetingId, userId);

        return res.json({ message: "Meeting deleted successfully", meeting });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
});

module.exports = router;
