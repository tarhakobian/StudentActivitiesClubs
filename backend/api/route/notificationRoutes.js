const express = require('express');
const clubService = require('../service/clubService');
const notificationService = require('../service/notificationService')
const { authenticate } = require('../middlewear/securityMiddlewear');
const { BadRequestError } = require('../errors/errors');
const Notification = require('../../database/model/notificationModel')

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 */



/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []  # Assuming you're using JWT for authentication
 *     responses:
 *       200:
 *         description: List of notifications sorted by read status and creation date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "651a88e96e7291e9b8c61413"
 *                   recipient:
 *                     type: string
 *                     example: "651a88e96e7291e9b8c61401"
 *                   sender:
 *                     type: string
 *                     example: "651a88e96e7291e9b8c61402"
 *                   message:
 *                     type: string
 *                     example: "New meeting announcement!"
 *                   entityType:
 *                     type: string
 *                     enum: ['Announcement', 'Meeting', 'ContactRequest']
 *                     example: "Announcement"
 *                   isRead:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-17T14:48:00.000Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const notifications = await notificationService.getNotificationsForUser(userId);
        res.status(200).json(notifications);
    } catch (error) {
        next(error)
    }
});


/**
 * @swagger
 * /notifications/{notificationId}:
 *   get:
 *     summary: Get a specific notification by its ID 
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []  # Assuming you're using JWT for authentication
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *           example: "651a88e96e7291e9b8c61413"
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "651a88e96e7291e9b8c61413"
 *                 recipient:
 *                   type: string
 *                   example: "651a88e96e7291e9b8c61401"
 *                 sender:
 *                   type: string
 *                   example: "651a88e96e7291e9b8c61402"
 *                 message:
 *                   type: string
 *                   example: "New meeting announcement!"
 *                 entityType:
 *                   type: string
 *                   enum: ['Announcement', 'Meeting', 'ContactRequest']
 *                   example: "Announcement"
 *                 isRead:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-17T14:48:00.000Z"
 *       404:
 *         description: Notification not found or access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Notification not found or access denied"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/:notificationId', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { notificationId } = req.params;

        const notification = await notificationService.getNotificationById(notificationId, userId);

        res.status(200).json(notification);
    } catch (error) {
        next(error)
    }
});

module.exports = router