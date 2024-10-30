require('dotenv').config()
const Announcement = require('../../database/model/announcementModel')
const Association = require('../../database/model/associationModel')
const Club = require('../../database/model/clubModel')
const User = require("../../database/model/userModel");
const Notification = require('../../database/model/notificationModel')
const { NotFoundError, AppError } = require('../errors/errors')
const clubService = require('../service/clubService');
const userService = require('../service/userService');
const meetingService = require('../service/meetingService');

const notificationMessages = {
    Announcement: (club, message, entityId) =>
        `📢 New Announcement from ${club.title}!\n\n${message}\n\nDon't miss out—click to view the full details!\n\n${BASE_URL}/club/announcements/${entityId}`,

    Meeting: (club, message, entityId) =>
        `📅 New Meeting for ${club.title}!\n\n${message}\n\nSee the full details at: ${BASE_URL}/club/meetings/${club._id}/${entityId}`
};

async function notify(entityId, entityDetails, entityType) {
    const clubId = entityDetails['clubId'];
    const club = await Club.findById(clubId).exec();
    
    const associations = await Association.find({ clubId: clubId, role: 'Member' }).exec();

    let message;
    if (entityType === 'Announcement') {
        const content = entityDetails['content'];
        message = content.length > 30 ? content.slice(0, 30) + "..." : content;
    } else if (entityType === 'Meeting') {
        const title = entityDetails['title'];
        message = title.length > 30 ? title.slice(0, 30) + "..." : title;
    }

    const createMessage = notificationMessages[entityType];
    if (!createMessage) {
        throw new AppError(`Unsupported entityType: ${entityType}`);
    }

    const notificationPromises = associations.map(a => {
        const notification = new Notification({
            recipient: a.userId,
            sender: club._id,
            message: createMessage(club, message, entityId),
            entityType: entityType
        });
        return notification.save();
    });

    await Promise.all(notificationPromises);
}

const getNotificationsForUser = async function (userId) {
    const notifications = await Notification.find({
        recipient: userId,
        scheduledForDeletion: false
    }).sort({ isRead: 1, createdAt: -1 });

    if (!notifications || notifications.length === 0) {
        throw new NotFoundError('No notifications found for this user.');
    }

    const notificationsWithSender = await Promise.all(notifications.map(async (n) => {
        let senderTitle;

        if (n.entityType === 'Announcement' || n.entityType === 'Meeting') {
            // For club-based notifications
            const club = await Club.findById(n.sender).select('title').exec();
            if (!club) throw new NotFoundError(`Club not found for sender ID: ${n.sender}`);
            senderTitle = club.title;
        } else if (n.entityType === 'ContactRequest') {
            // For contact request notifications
            const user = await User.findById(n.sender).select('name').exec();
            if (!user) throw new NotFoundError(`User not found for sender ID: ${n.sender}`);
            senderTitle = user.name;
        }

        return {
            ...n._doc,
            sender: senderTitle,
        };
    }));

    return notificationsWithSender;
};

const getNotificationById = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId,
        scheduledForDeletion: false // Only retrieve if not scheduled for deletion
    });

    if (!notification) {
        throw new NotFoundError(`Notification not found for ID: ${notificationId} and user: ${userId}`);
    }

    const senderId = notification.sender;
    let senderTitle;

    if (notification.entityType === 'Announcement' || notification.entityType === 'Meeting') {
        // If notification is announcement or meeting, the sender will be a club
        const club = await clubService.findClubById(senderId)
        senderTitle = club.title;
    } else if (notification.entityType === 'ContactRequest') {
        // If notificaiton is contact request, sender is user
        const user = await userService.findUserById(senderId)
        senderTitle = user.name;
    } else {
        throw new AppError("Invalid entity type");
    }

    if (!notification.isRead) {
        notification.isRead = true;
        await notification.save();
        // After setting isRead = true AND SAVING IT, it's set BACK to false (but NOT saved as fakse) to let the frontent know this is the FIRST time 'reading' this notification
        notification.isRead = false;
    }

    return {
        ...notification._doc,
        sender: senderTitle
    };
};

const scheduleNotificationForDeletion = async (notificationId, userId) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { $set: { scheduledForDeletion: true } },
            { new: true }
        );

        if (!notification) {
            throw new NotFoundError(`Notification not found for ID: ${notificationId}`);
        }

        return notification;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new AppError("Failed to mark notification for deletion. Please try again later.");
    }
};

module.exports = { notify, getNotificationsForUser, getNotificationById, scheduleNotificationForDeletion }