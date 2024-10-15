const Announcement = require("../../database/model/announcementModel")

/**
 * @typedef {Object} Announcement
 */
function mapAnnuncement(announcement){
    return {
        id: announcement._id,
        createdAt: announcement.createdAt,
        title: announcement.title,
        content: announcement.content,
        attachments: announcement.attachments
    }
}

module.exports = {mapAnnuncement}