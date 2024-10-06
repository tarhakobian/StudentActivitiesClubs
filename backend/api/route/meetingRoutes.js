const express = require('express');
const { createMeeting, deleteMeeting, getAllMeetings, getMeetingById, toggleMeetingActive, updateMeeting } = require('../service/meetingService');
const { authenticate } = require('../middlewear/securityMiddlewear');

const router = express.Router();

/**
 * @swagger
 *  paths:
 *    /club/meetings/{clubId}:
 *      get:
 *        tags:
 *          - Meetings
 *        summary: Retrieve all meetings for a specific club
 *        description: This endpoint retrieves all meetings associated with a given club ID.
 *        security:
 *          - bearerAuth: [] 
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The ID of the club to retrieve meetings for.
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: A list of meetings for the specified club.
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: The unique identifier for the meeting.
 *                      title:
 *                        type: string
 *                        description: The title of the meeting.
 *                      date:
 *                        type: string
 *                        format: date-time
 *                        description: The date and time of the meeting.
 *                      location:
 *                        type: string
 *                        description: The location of the meeting.
 *                      description:
 *                        type: string
 *                        description: A brief description of the meeting.
 *          401:
 *            description: Unauthorized - invalid or missing authentication token.
 *          404:
 *            description: Not Found - no meetings found for the specified club ID.
 *          500:
 *            description: Internal server error
 */
router.get('/:clubId', authenticate, async (req, res, next) => {
    try {
        const clubId = req.params['clubId'];
        const userId = req.user.userId;

        const meetings = await getAllMeetings(clubId, userId);

        return res.status(200).json(meetings);
    } catch (error) {
        next(error)
    }
});

/**
 * @swagger
 *  paths:
 *    /club/meetings/{clubId}/meetings/{meetingId}:
 *      get:
 *        tags:
 *          - Meetings
 *        summary: Retrieve a specific meeting by its ID
 *        description: This endpoint retrieves a meeting associated with a specific club ID and meeting ID.
 *        security:
 *          - bearerAuth: [] 
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The ID of the club to which the meeting belongs.
 *            schema:
 *              type: string
 *          - in: path
 *            name: meetingId
 *            required: true
 *            description: The ID of the meeting to retrieve.
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: Meeting retrieved successfully.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: The unique identifier for the meeting.
 *                    title:
 *                      type: string
 *                      description: The title of the meeting.
 *                    date:
 *                      type: string
 *                      format: date-time
 *                      description: The date and time of the meeting.
 *                    location:
 *                      type: string
 *                      description: The location of the meeting.
 *                    description:
 *                      type: string
 *                      description: A brief description of the meeting.
 *          401:
 *            description: Unauthorized - invalid or missing authentication token.
 *          404:
 *            description: Not Found - no meeting found for the specified club ID and meeting ID.
 *          500:
 *            description: Internal server error
 */
router.get('/:clubId/:meetingId', authenticate, async (req, res, next) => {
    const { clubId, meetingId } = req.params;
    const userId = req.user.userId;

    try {
        const meeting = await getMeetingById(clubId, meetingId, userId);
        res.status(200).json(meeting);
    } catch (error) {
        next()
    }
});

/**
 * @swagger
 *  paths:
 *    /club/{clubId}/meetings:
 *      post:
 *        tags:
 *          - Meetings
 *        summary: Create a new meeting for a specific club
 *        description: This endpoint allows authenticated users to create a new meeting associated with a specific club ID.
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The ID of the club for which the meeting is being created.
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
 *                    description: The title of the meeting.
 *                  date:
 *                    type: string
 *                    format: date-time
 *                    description: The date and time of the meeting.
 *                  location:
 *                    type: string
 *                    description: The location of the meeting.
 *                  description:
 *                    type: string
 *                    description: A brief description of the meeting.
 *        responses:
 *          201:
 *            description: Meeting created successfully.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: The unique identifier for the newly created meeting.
 *                    title:
 *                      type: string
 *                      description: The title of the meeting.
 *                    date:
 *                      type: string
 *                      format: date-time
 *                      description: The date and time of the meeting.
 *                    location:
 *                      type: string
 *                      description: The location of the meeting.
 *                    description:
 *                      type: string
 *                      description: A brief description of the meeting.
 *          401:
 *            description: Unauthorized - invalid or missing authentication token.
 *          400:
 *            description: Bad Request - required fields are missing or invalid.
 *          500:
 *            description: Internal server error
 */
router.post('/:clubId', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const clubId = req.params['clubId'];

        const meeting = await createMeeting(clubId, userId, req.body);
        return res.status(201).json(meeting);
    } catch (error) {
        next(error)
    }
});

/**
 * @swagger
 *  paths:
 *    /meetings/{meetingId}:
 *      put:
 *        tags:
 *          - Meetings
 *        summary: Update an existing meeting by its ID
 *        description: This endpoint allows authenticated users to update the details of a meeting using its ID.
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: path
 *            name: meetingId
 *            required: true
 *            description: The unique identifier of the meeting to update.
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
 *                    description: The updated title of the meeting.
 *                  date:
 *                    type: string
 *                    format: date-time
 *                    description: The updated date and time of the meeting.
 *                  location:
 *                    type: string
 *                    description: The updated location of the meeting.
 *                  description:
 *                    type: string
 *                    description: The updated description of the meeting.
 *        responses:
 *          200:
 *            description: Meeting updated successfully.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: The unique identifier for the updated meeting.
 *                    title:
 *                      type: string
 *                      description: The updated title of the meeting.
 *                    date:
 *                      type: string
 *                      format: date-time
 *                      description: The updated date and time of the meeting.
 *                    location:
 *                      type: string
 *                      description: The updated location of the meeting.
 *                    description:
 *                      type: string
 *                      description: The updated description of the meeting.
 *          400:
 *            description: Bad request - Invalid input data.
 *          401:
 *            description: Unauthorized - The user is not authenticated.
 *          404:
 *            description: Not Found - Meeting with the given ID does not exist.
 *          500:
 *            description: Internal server error
 */
router.put('/:meetingId', authenticate, async (req, res, next) => {
    try {
        const meeting = await updateMeeting(req.params.meetingId, req.body);
        return res.status(200).json(meeting);
    } catch (error) {
        next(error)
    }
});

/**
 * @swagger
 *  paths:
 *    /meetings/{clubId}/{meetingId}:
 *      delete:
 *        tags:
 *          - Meetings
 *        summary: Delete a meeting by its ID
 *        description: This endpoint allows authenticated users to delete a specific meeting from a club using its ID.
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The unique identifier of the club from which the meeting will be deleted.
 *            schema:
 *              type: string
 *          - in: path
 *            name: meetingId
 *            required: true
 *            description: The unique identifier of the meeting to be deleted.
 *            schema:
 *              type: string
 *        responses:
 *          204:
 *            description: Meeting deleted successfully.
 *          400:
 *            description: Bad request - Invalid input data.
 *          401:
 *            description: Unauthorized - The user is not authenticated.
 *          404:
 *            description: Not Found - Meeting with the given ID does not exist or does not belong to the specified club.
 *          500:
 *            description: Internal server error
 */
router.delete('/:clubId/:meetingId', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const clubId = req.params['clubId'];
        const meetingId = req.params['meetingId'];

        const meeting = await deleteMeeting(clubId, meetingId, userId);

        return res.status(204).json({ message: "Meeting deleted successfully", meeting });
    } catch (error) {
        next
    }
});

module.exports = router;
