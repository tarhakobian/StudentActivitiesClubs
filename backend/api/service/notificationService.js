require('dotenv').config()
const Announcement = require('../../database/model/announcementModel')
const Association = require('../../database/model/associationModel')
const Club = require('../../database/model/clubModel')
const Notification = require('../../database/model/notificationModel')
const { NotFoundError, AppError } = require('../errors/errors')


async function notify(entityId, entityDetails, entityType) {
    const clubId = entityDetails['clubId'];

    const club = await Club.findById(clubId).exec();

    const associations = await Association.find({ clubId: clubId, role: 'Member' }).exec();

    const BASE_URL = process.env.BASE_URL

    if (entityType === 'Announcement') {
        const content = entityDetails['content'];
        const message = `${content.length > 30 ? content.slice(0, 30) + "..." : content}`; // Check if content is longer than 30 characters to display the dots (...)
        const notificationPromises = associations.map(a => {
            const notification = new Notification({
                recipient: a.userId,
                sender: club._id,
                message: `📢 New Announcement from ${club.title}! \n\n ${message}\n\n Don't miss out—click to view the full details!\n\n ${BASE_URL}club/announcements/${entityId} `, // Go to announcement by ID? or all announcements
                entityType: 'Announcement'
            });
    
            return notification.save();
        });
        await Promise.all(notificationPromises);
    }

    if (entityType === 'Meeting') {
        const title = entityDetails['title'];
        const message = `${title.length > 30 ? title.slice(0, 30) + "..." : title}`; // Check if title is longer than 30 characters to display the dots (...)
        const notificationPromises = associations.map(a => {
            const notification = new Notification({
                recipient: a.userId,
                sender: club._id,
                message: `📅 New Meeting for ${club.title}! \n\n ${message}\n\n See the full details at: ${BASE_URL}club/meetings/${clubId}/${entityId}`, // Not sure if we should have it go to link BY meeting ID or just all meetings?
                entityType: 'Meeting'
            });
    
            return notification.save();
        });
        await Promise.all(notificationPromises);
    }
}

const getNotificationsForUser = async (userId) => {
    try {
        let notifications = await Notification.find({ recipient: userId }).sort({ isRead: 1, createdAt: -1 });

        if (!notifications) {
            throw new NotFoundError()
        }

        const clubTitle = await Club.findById(notifications.sender).select('title').exec();

        if (!clubTitle) {
            throw new NotFoundError()
        }

        notifications = notifications.map(n => ({
            ...n._doc,
            sender: clubTitle
        }));

        return notifications;
    } catch (error) {
        throw new AppError("Something went wrong")
    }
};

const getNotificationById = async (notificationId, userId) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { $set: { isRead: true } },
            { new: true }
        );

        if (!notification) {
            throw new NotFoundError()
        }

        const clubTitle = await Club.findById(notification.sender).select('title').exec();

        if (!clubTitle) {
            throw new NotFoundError()
        }

        notification.sender = clubTitle

        return notification;
    } catch (error) {
        throw new NotFoundError()
    }
};


module.exports = { notify, getNotificationsForUser, getNotificationById }