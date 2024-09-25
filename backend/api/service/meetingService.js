const Meeting = require('../../database/model/meetingModel');
const User = require('../../database/model/userModel');
const Club = require('../../database/model/clubModel');

const { ensureOwnership } = require('./authService');
const { UnauthorizedError, BadRequestError, NotFoundError } = require('../errors/errors');

// Create a new meeting
async function createMeeting(clubId, userId, body) {
    const role = await ensureOwnership(clubId, userId)

    if (role === 'MEMBER') {
        throw new UnauthorizedError("Unauthorized")
    }

    const { title, agenda, date, location, attachments } = body;

    if (!title || !agenda || !date || !location) {
        throw new BadRequestError("All fields (title, agenda, date, location) must be provided and non-null.");
    }

    const meeting = new Meeting({
        title, agenda, date, location, attachments, authorId: userId, clubId, lastUpdatedAt: new Date, lastUpdatedBy: userId
    });

    await meeting.save();

    return meeting._id
}


// Get all meetings for a club
async function getAllMeetings(clubId, userId) {
    await ensureOwnership(clubId, userId)

    const meetings = await Meeting.find({
        clubId: clubId,
        isActive: true
    }).select('title agenda date location attachments createdAt').sort({ date: 1 }).exec();

    return meetings;
}

// Get a meeting by ID
async function getMeetingById(clubId, meetingId, userId) {
    await ensureOwnership(clubId, userId)

    const meeting = await Meeting.findOne({
        _id: meetingId,
        isActive: true
    }).select('title agenda date location createdAt attachments participants').exec();

    if (!meeting) {
        throw new NotFoundError(`Meeting not found with the id - ${meetingId} `)
    }

    return meeting;
}

// Update a meeting
async function updateMeeting(meetingId, updateDetails) {
    const meeting = await Meeting.findById(meetingId).exec();
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
async function deleteMeeting(clubId, meetingId, userId) {
    const role = await ensureOwnership(clubId, userId);

    if (role === "Member") {
        throw new UnauthorizedError("Unauthorized")
    }

    const meeting = await Meeting.findByIdAndDelete(meetingId).exec();

    if (!meeting) {
        throw new NotFoundError(`Meeting with id ${meetingId} not found`);
    }

    return meeting;
}


// Toggle meeting active status
async function toggleMeetingActive(clubId, meetingId, userId) {
    const role = ensureOwnership(clubId, userId);

    if (role === 'Member') {
        throw new UnauthorizedError("Unauthorized")
    }

    const meeting = await Meeting.findById(meetingId).exec();

    if (!meeting) {
        throw new NotFoundError(`Meeting with id ${meetingId} not found`);
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