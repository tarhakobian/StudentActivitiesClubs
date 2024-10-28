const Announcement = require('../../database/model/announcementModel');
const Club = require('../../database/model/clubModel');
const { findUserById } = require('./userService')
const { CabinetMemberRequiredError, NotFoundError } = require('../errors/errors');
const { ensureOwnership } = require('./authService')
const { notify } = require('./notificationService')
const { mapAnnuncement } = require('./mapperService');
const Association = require('../../database/model/associationModel');


async function getAllAnnouncements(clubId, userId) {
    await ensureOwnership(clubId, userId)

    const announcements = await Announcement.find({ clubId: clubId, isActive: true })
        .select('date title content attachments')
        .sort({ createdAt: -1 });

    return announcements.map(announcement => mapAnnuncement(announcement));
}

async function getAnnouncementById(userId, announcementId) {
    let announcement = await Announcement.findById(announcementId).exec()

    if (!announcement) {
        throw new NotFoundError(`Announcement with id ${getAnnouncementById} is not found`)
    }

    const clubId = announcement.clubId

    const role = await ensureOwnership(userId, clubId)

    if (!announcement.isActive && role === "Member") {
        throw new NotFoundError(`Announcement with id ${getAnnouncementById} is not found`)
    }

    //maps to DTO
    announcement = mapAnnuncement(announcement)

    return announcement
}

async function createAnnouncement(announcementDetails) {

    const role = await ensureOwnership(announcementDetails['clubId'], announcementDetails['authorId'])

    // Not a cabinet member or Admin
    if (role === 'Member') {
        throw new CabinetMemberRequiredError("Unauthorized action")
    }

    const announcement = await new Announcement(announcementDetails).save();

    notify(announcement._id, announcementDetails, "Announcement")

    return announcement._id;
}

async function deleteAnnouncement(announcementId, userId) {
    const announcement = await Announcement.findById(announcementId).exec()
    const clubId = announcement.clubId
    const role = await ensureOwnership(clubId, userId)

    if (role === 'Member') {
        throw new CabinetMemberRequiredError("Unauthorized")
    }

    await Announcement.deleteOne(announcement._id)
}

async function editAnnouncement(userId, announcementId, body) {
    const announcement = await Announcement.findById(announcementId).exec();

    if (!announcement) {
        throw new NotFoundError("Announcement not found");
    }

    const clubId = announcement.clubId;

    const role = await ensureOwnership(clubId, userId);

    if (role === 'Member') {
        throw new CabinetMemberRequiredError("Unauthorized");
    }

    announcement.title = body.title || announcement.title;
    announcement.content = body.content || announcement.content;
    announcement.attachments = body.attachments || announcement.attachments;
    announcement.lastUpdatedAt = new Date();
    announcement.lastUpdatedBy = userId;

    await announcement.save();

    return { message: "Announcement updated successfully", announcement };
}

async function announcementsChangeActiveStatus(announcementId, userId) {
    const announcement = await Announcement.findById(announcementId).exec();

    if (!announcement) {
        throw new NotFoundError("Announcement not found");
    }

    const clubId = announcement.clubId;

    const role = await ensureOwnership(clubId, userId);

    if (role === 'Member') {
        throw new CabinetMemberRequiredError("Unauthorized");
    }

    announcement.isActive = !announcement.isActive

    await announcement.save();
}


module.exports = {
    createAnnouncement,
    deleteAnnouncement,
    editAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    announcementsChangeActiveStatus
}