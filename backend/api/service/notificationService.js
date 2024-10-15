const Announcement = require('../../database/model/announcementModel')
const Association = require('../../database/model/associationModel')
const Club = require('../../database/model/clubModel')
const Notification = require('../../database/model/notificationModel')


async function notifyAnnouncement(announcementDetails) {
    const clubId = announcementDetails['clubId'];
    const content = announcementDetails['content'];

    const club = await Club.findById(clubId).exec();

    const associations = await Association.find({ clubId: clubId, role: 'Member' }).exec();

    const notificationPromises = associations.map(a => {
        const notification = new Notification({
            recipient: a.userId,
            sender: club._id,
            message: `${club.title} has just posted a new announcement. Check this out! \n ${content.slice(0, 30)}...`,
            entityType: 'Announcement'
        });

        return notification.save();
    });

    await Promise.all(notificationPromises);
}

module.exports = { notifyAnnouncement }