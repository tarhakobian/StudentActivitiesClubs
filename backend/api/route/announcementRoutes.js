const express = require('express');
const announcementService = require('../service/announcementService');
const { authenticate } = require('../middlewear/securityMiddlewear');
const { MissingParametersError } = require('../errors/errors');

const router = express.Router();

//TODO:  Make a route for club's cabinet to access announcement that are not active but hasn't been deleted yet.


/**
 * @swagger
 *  paths:
 *    /club/announcements/{clubId}:
 *      get:
 *        tags:
 *          - Announcements
 *        summary: Get all announcements for a specific club
 *        description: This endpoint retrieves all announcements for a club the user is a member of.
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The unique identifier of the club
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: A list of announcements for the club
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: The unique identifier of the announcement
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        description: The date the announcement was made
 *                      title:
 *                        type: string
 *                        description: The title of the announcement
 *                      content:
 *                        type: string
 *                        description: The content of the announcement
 *                      attachments:
 *                        type: array
 *                        items:
 *                          type: string
 *                        description: An array of attachment URLs related to the announcement
 *          401:
 *            description: Unauthorized - The user is not authenticated
 *          403:
 *            description: Forbidden - The user does not have permission to view announcements for the specified club
 *          500:
 *            description: Internal server error
 */
router.get('/:clubId', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const clubId = req.params['clubId'];

        const announcements = await announcementService.getAllAnnouncements(clubId, userId);

        res.status(200).json(announcements);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /announcement/{announcementId}:
 *   get:
 *     summary: Retrieve an announcement by its ID
 *     description: This endpoint retrieves the announcement details by its ID if the user is authenticated.
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: announcementId
 *         required: true
 *         description: The ID of the announcement to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the announcement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *                   properties:
 *                      id:
 *                        type: string
 *                        description: The unique identifier of the announcement
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        description: The date the announcement was made
 *                      title:
 *                        type: string
 *                        description: The title of the announcement
 *                      content:
 *                        type: string
 *                        description: The content of the announcement
 *                      attachments:
 *                        type: array
 *                        items:
 *                          type: string
 *                          description: An array of attachment URLs related to the announcement
 *       404:
 *         description: Announcement not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/announcementId', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const announcementId = req.params['announcementId']

        const announcement = await announcementService.getAnnouncementById(userId, announcementId)

        res.status(200).json(announcement)
    } catch (error) {
        next(error)
    }
})

/**
 * @swagger
 *  paths:
 *    /club/announcements/{clubId}:
 *      post:
 *        tags:
 *          - Announcements
 *        summary: Create a new announcement for a specific club
 *        description: This endpoint allows authenticated users to create an announcement for a specific club. The user must provide the title, content, and optionally, attachments.
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The unique identifier of the club
 *            schema:
 *              type: string
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    description: The title of the announcement
 *                  content:
 *                    type: string
 *                    description: The body/content of the announcement
 *                  attachments:
 *                    type: array
 *                    items:
 *                      type: string
 *                    description: Optional attachments related to the announcement
 *              example:
 *                title: "Club Announcement 1"
 *                content: "Content 1"
 *                attachments:
 *                  - "https://example.com/meeting-agenda.pdf"
 *                  - "https://example.com/meeting-slides.pptx"
 *        responses:
 *          201:
 *            description: Announcement created successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Success message
 *                    announcement:
 *                      type: string
 *                      description: The unique identifier of the created announcement
 *          400:
 *            description: Bad request - Missing required parameters
 *          401:
 *            description: Unauthorized - The user is not authenticated
 *          403:
 *            description: Forbidden - The user is not authorized to create an announcement for this club
 *          500:
 *            description: Internal server error
 */
router.post('/:clubId', authenticate, async (req, res, next) => {
    try {
        const { title, content, attachments } = req.body;

        const userId = req.user.userId;
        const clubId = req.params['clubId'];

        if (!title || !content || !clubId) {
            throw new MissingParametersError();
        }

        const announcementDetails = {
            title,
            content,
            authorId: userId,
            clubId,
            attachments: attachments || [],
        };

        const announcementId = await announcementService.createAnnouncement(announcementDetails);

        res.status(201).json({
            message: 'Announcement created successfully',
            announcement: announcementId,
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 *  paths:
 *    /club/announcements/{announcementId}:
 *      delete:
 *        tags:
 *          - Announcements
 *        summary: Delete an announcement by its ID
 *        description: This endpoint allows authenticated users to delete a specific announcement, given the announcement's unique ID.
 *        security:
 *          - bearerAuth: [] 
 *        parameters:
 *          - in: path
 *            name: announcementId
 *            required: true
 *            description: The unique identifier of the announcement to delete
 *            schema:
 *              type: string
 *        responses:
 *          204:
 *            description: Announcement deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Success message
 *                    announcement:
 *                      type: string
 *                      description: The unique identifier of the deleted announcement
 *          400:
 *            description: Bad request - Missing announcementId
 *          401:
 *            description: Unauthorized - The user is not authenticated
 *          403:
 *            description: Forbidden - The user is not allowed to delete the announcement
 *          500:
 *            description: Internal server error
 */
router.delete('/:announcementId', authenticate, async (req, res, next) => {
    const announcementId = req.params['announcementId'];
    const userId = req.user.userId;

    if (!announcementId) {
        return res.status(400).send('Missing announcementId');
    }

    try {
        await announcementService.deleteAnnouncement(announcementId, userId);
        res.status(204).json({
            message: 'Announcement deleted successfully',
            announcement: announcementId,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 *  paths:
 *    /club/announcements/{announcementId}:
 *      put:
 *        tags:
 *          - Announcements
 *        summary: Update an announcement by its ID
 *        description: This endpoint allows authenticated users to update the title, content, or attachments of an announcement by its ID.
 *        security:
 *          - bearerAuth: [] 
 *        parameters:
 *          - in: path
 *            name: announcementId
 *            required: true
 *            description: The unique identifier of the announcement to update
 *            schema:
 *              type: string
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    description: The title of the announcement
 *                  content:
 *                    type: string
 *                    description: The body/content of the announcement
 *                  attachments:
 *                    type: array
 *                    items:
 *                      type: string
 *                    description: Optional attachments related to the announcement
 *        responses:
 *          200:
 *            description: Announcement updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: The ID of the updated announcement
 *                    title:
 *                      type: string
 *                      description: The title of the announcement
 *                    content:
 *                      type: string
 *                      description: The body/content of the announcement
 *                    attachments:
 *                      type: array
 *                      items:
 *                        type: string
 *                      description: Attachments associated with the announcement
 *          400:
 *            description: Bad request - No fields provided for update
 *          401:
 *            description: Unauthorized - The user is not authenticated
 *          403:
 *            description: Forbidden - The user is not authorized to update the announcement
 *          500:
 *            description: Internal server error
 */
router.put('/:announcementId', authenticate, async (req, res, next) => {
    const announcementId = req.params['announcementId'];
    const userId = req.user.userId;
    const body = req.body;

    try {
        if (!body.title && !body.content && !body.attachments) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const announcement = await announcementService.editAnnouncement(userId, announcementId, body);
        return res.status(200).json(announcement);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 *  paths:
 *    /club/announcements/{announcementId}/changeActiveStatus:
 *      patch:
 *        tags:
 *          - Announcements
 *        summary: Change the active status of an announcement
 *        description: This endpoint allows authenticated users to change the active status of an announcement by its ID.
 *        security:
 *          - bearerAuth: [] 
 *        parameters:
 *          - in: path
 *            name: announcementId
 *            required: true
 *            description: The unique identifier of the announcement
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: Successfully changed the active status of the announcement
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: Active status changed successfully
 *          400:
 *            description: Bad request - Missing or invalid announcementId
 *          401:
 *            description: Unauthorized - The user is not authenticated
 *          403:
 *            description: Forbidden - The user is not authorized to change the active status
 *          500:
 *            description: Internal server error
 */
router.patch('/:announcementId/changeActiveStatus', authenticate, async (req, res, next) => {
    const announcementId = req.params['announcementId'];
    const userId = req.user.userId;

    try {
        await announcementService.announcementsChangeActiveStatus(announcementId, userId);
        res.status(200).json({ message: "Active status changed successfully" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;