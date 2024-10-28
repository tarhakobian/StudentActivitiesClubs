require('dotenv').config()
const Announcement = require('../../database/model/announcementModel')
const Association = require('../../database/model/associationModel')
const Club = require('../../database/model/clubModel')
const Notification = require('../../database/model/notificationModel')
const { NotFoundError, AppError } = require('../errors/errors')


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
            message: `📢 New Announcement from ${club.title}! \n\n ${content.slice(0, 30)}...\n\n Don't miss out—click to view the full details!\n\n ${BASE_URL}club/announcements/${announcementId} `,
            entityType: 'Announcement'
        });

        return notification.save();
    });

    await Promise.all(notificationPromises);
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


module.exports = { notifyAnnouncement, getNotificationsForUser, getNotificationById }