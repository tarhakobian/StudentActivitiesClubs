require('dotenv').config()
const Announcement = require('../../database/model/announcementModel')
const Association = require('../../database/model/associationModel')
const Club = require('../../database/model/clubModel')
const Notification = require('../../database/model/notificationModel')


async function notifyAnnouncement(announcementId, announcementDetails) {
    const clubId = announcementDetails['clubId'];
    const content = announcementDetails['content'];

    const club = await Club.findById(clubId).exec();

    const associations = await Association.find({ clubId: clubId, role: 'Member' }).exec();

    const BASE_URL = process.env.BASE_URL

    const notificationPromises = associations.map(a => {
        const notification = new Notification({
            recipient: a.userId,
            sender: club._id,
            message: `📢 New Announcement from ${club.title}! \n\n ${content.slice(0, 30)}...\n\n Don't miss out—click to view the full details!\n\n ${BASE_URL}/club/announcements/${announcementId} `,
            entityType: 'Announcement'
        });

        return notification.save();
    });

    await Promise.all(notificationPromises);
}

module.exports = { notifyAnnouncement }