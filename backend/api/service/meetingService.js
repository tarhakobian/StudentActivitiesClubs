const Meeting = require('../../database/model/meetingModel');
const User = require('../../database/model/userModel');
const Club = require('../../database/model/clubModel');

const {ensureOwnership} = require('./authService')

async function findMeetingById(meetingId) {
    const meeting = Meeting.findById(meetingId).exec()

    if (!meeting) {
        throw new Error(`Meeting with id ${meetingId} not found`);
    }

    return meeting;
}

// Create a new meeting
async function createMeeting(req) {
    const userId = req.user.userId

    const {title, agenda, date, location, attachments, clubId} = req.body;

    const role = await ensureOwnership(clubId, userId)

    if (role === 'Member') {
        throw new Error("Unauthorized")
    }

    const meeting = new Meeting({
        title, agenda, date, location, attachments, authorId: userId, clubId
    });
    return await meeting.save();
}

// Get all meetings for a club
async function getAllMeetings(req) {
    const userId = req.user.userId
    const clubId = req.params['clubId']

    await ensureOwnership(clubId, userId)

    const meetings = await Meeting.find({
        clubId: clubId,
        isActive: true
    }).select('title agenda date location attachments createdAt').exec();

    // meetings.map(m =>)
}

// Get a meeting by ID
async function getMeetingById(meetingId) {
    const meeting = await findMeetingById(meetingId);

    return meeting;
}

// Update a meeting
async function updateMeeting(meetingId, updateDetails) {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
        throw new Error(`Meeting with id ${meetingId} not found`);
    }

    // Update fields
    Object.assign(meeting, updateDetails);
    meeting.lastUpdatedAt = new Date();
    await meeting.save();
    return meeting;
}

// Delete a meeting
async function deleteMeeting(meetingId) {
    const meeting = await Meeting.findByIdAndDelete(meetingId);
    if (!meeting) {
        throw new Error(`Meeting with id ${meetingId} not found`);
    }
    return meeting;
}

// Add participants to a meeting
async function addParticipants(meetingId, userIds) {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
        throw new Error(`Meeting with id ${meetingId} not found`);
    }

    meeting.participants.push(...userIds);
    await meeting.save();
    return meeting;
}

// Remove participants from a meeting
async function removeParticipant(meetingId, userId) {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
        throw new Error(`Meeting with id ${meetingId} not found`);
    }

    meeting.participants = meeting.participants.filter(participant => participant.toString() !== userId);
    await meeting.save();
    return meeting;
}

// Toggle meeting active status
async function toggleMeetingActive(meetingId) {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
        throw new Error(`Meeting with id ${meetingId} not found`);
    }

    meeting.isActive = !meeting.isActive;
    await meeting.save();
    return meeting;
}

module.exports = {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting,
    addParticipants,
    removeParticipant,
    toggleMeetingActive,
};