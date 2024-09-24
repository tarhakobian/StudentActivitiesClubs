const Meeting = require('../../database/model/meetingModel');
const User = require('../../database/model/userModel');
const Club = require('../../database/model/clubModel');

const { ensureOwnership } = require('./authService')

// Create a new meeting
async function createMeeting(clubId, userId,body) {
    const role = await ensureOwnership(clubId, userId)

    if (role === 'MEMBER') {
        throw new Error("Unauthorized")
    }

    const { title, agenda, date, location, attachments } = body;

    if (!title || !agenda || !date || !location) {
        throw new Error("All fields (title, agenda, date, location) must be provided and non-null.");
    }

    const meeting = new Meeting({
        title, agenda, date, location, attachments, authorId: userId, clubId, lastUpdatedAt: new Date, lastUpdatedBy: userId
    });

    await meeting.save();

    return meeting._id
}


// Get all meetings for a club
async function getAllMeetings(clubId,userId) {
    await ensureOwnership(clubId, userId)

    const meetings = await Meeting.find({
        clubId: clubId,
        isActive: true
    }).select('title agenda date location attachments createdAt').exec();

    return meetings;
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
    meeting.lastUpdatedBy = 
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
    toggleMeetingActive,
};