const express = require('express');
const { createMeeting, joinMeeting, deleteMeeting, leaveMeeting, getAllMeetings, getMeetingById, getAllParticipants, toggleMeetingActive, updateMeeting, meetingsChangeActiveStatus } = require('../service/meetingService');
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
 *                    required:
 *                      - clubId
 *                    example:
 *                      id: "string"
 *                      title: "string"
 *                      date: "string"
 *                      location: "string"
 *                      description: "string"
 * 
 *                      
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
 *    /club/meetings/{clubId}/{meetingId}:
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
 *    /club/meetings/{clubId}/{meetingId}/participants:
 *      get:
 *        tags:
 *          - Meetings
 *        summary: Retrieve a specific meeting's participants
 *        description: This endpoint retrieves the participants of a specific meeting associated with a specific club ID and meeting ID.
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
 *            description: The ID of the meeting to retrieve the participants of.
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: Participants retrieved successfully.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    participants:
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
router.get('/:clubId/:meetingId/participants', authenticate, async (req, res, next) => {
    const { clubId, meetingId } = req.params;
    const userId = req.user.userId;

    try {
        const participants = await getAllParticipants(clubId, meetingId, userId);
        console.log(participants)
        return res.status(200).json(participants);
    } catch (error) {
        next(error)
    }
});

/**
 * @swagger
 *  paths:
 *    /club/meetings/{clubId}:
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
 *                  agenda:
 *                      type: string
 *                      description: The agenda of the meeting.
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
 *    /club/meetings/{clubId}/{meetingId}/participants:
 *      post:
 *        tags:
 *          - Meetings
 *        summary: Join a meeting as a participant
 *        description: This endpoint allows authenticated users to join a specific meeting by adding themselves as participants.
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The ID of the club associated with the meeting.
 *            schema:
 *              type: string
 *          - in: path
 *            name: meetingId
 *            required: true
 *            description: The ID of the meeting the user wants to join.
 *            schema:
 *              type: string
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  participantId:
 *                    type: string
 *                    description: The ID of the participant joining the meeting.
 *                  meetingId:
 *                    type: string
 *                    description: The ID of the meeting.
 *                example:
 *                  participantId: "string"
 *                  meetindId: "string"
 *        responses:
 *          200:
 *            description: Participant added to the meeting successfully.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    participants:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            description: The ID of the participant.
 *                    participantsLength:
 *                      type: integer
 *                      description: The number of participants in the meeting.
 *          400:
 *            description: Bad Request - user is already a participant or invalid data.
 *          401:
 *            description: Unauthorized - invalid or missing authentication token.
 *          404:
 *            description: Not Found - club or meeting not found.
 *          500:
 *            description: Internal server error.
 */
router.post('/:clubId/:meetingId/participants', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { clubId, meetingId } = req.params; 

        const meeting = await joinMeeting(clubId, meetingId, userId);

        return res.status(200).json({
            participants: meeting,
            participantsLength: meeting.length
        });
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 *  paths:
 *    /club/meetings/{meetingId}:
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
 *    /club/meetings/{clubId}/{meetingId}:
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
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  clubId:
 *                    type: string
 *                    description: The Id of the club.
 *                  meetingId:
 *                      type: string
 *                      description: The Id of the meeting.
 *        responses:
 *          200:
 *            description: Successfully deleted the meeting.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "Successfully deleted the meeting."
 *          401:
 *            description: Unauthorized - invalid or missing authentication token.
 *          404:
 *            description: Not Found - meeting not found.
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

/**
 * @swagger
 *  paths:
 *    /club/meetings/{clubId}/{meetingId}/participants:
 *      delete:
 *        tags:
 *          - Meetings
 *        summary: Remove a user from a meeting's participants (leave a meeting)
 *        description: This endpoint allows authenticated users to leave a meeting they are part of.
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The ID of the club.
 *            schema:
 *              type: string
 *          - in: path
 *            name: meetingId
 *            required: true
 *            description: The ID of the meeting.
 *            schema:
 *              type: string
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  clubId:
 *                    type: string
 *                    description: The ID of the club.
 *                  meetingId:
 *                      type: string
 *                      description: The Id of the meeting.
 *        responses:
 *          200:
 *            description: Successfully left the meeting.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "Successfully left the meeting."
 *          401:
 *            description: Unauthorized - invalid or missing authentication token.
 *          404:
 *            description: Not Found - meeting or participant not found.
 *          500:
 *            description: Internal server error
 */
router.delete('/:clubId/:meetingId/participants', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { clubId, meetingId } = req.params;

        await leaveMeeting(clubId, meetingId, userId);
        return res.status(200).json({ message: 'Successfully left the meeting.' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 *  paths:
 *    /club/meetings/{clubId}/{meetingId}/changeActiveStatus:
 *      patch:
 *        tags:
 *          - Meetings
 *        summary: Change active status of a meeting
 *        description: This endpoint allows users to change the active status of a specific meeting. Only users with the appropriate permissions can change the status.
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: path
 *            name: clubId
 *            required: true
 *            description: The ID of the club whose meeting active status is to be changed.
 *            schema:
 *              type: string
 *          - in: path
 *            name: meetingId
 *            required: true
 *            description: The ID of the meeting whose active status is to be changed.
 *            schema:
 *              type: string
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  clubId:
 *                    type: string
 *                    description: The ID of the club.
 *                  meetingId:
 *                      type: string
 *                      description: The Id of the meeting.
 *        responses:
 *          200:
 *            description: Active status changed successfully.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Confirmation message indicating the status change.
 *                      example: "Active status changed successfully"
 *          401:
 *            description: Unauthorized - the user does not have permission to change the status.
 *          404:
 *            description: Not Found - meeting with the specified ID not found.
 *          500:
 *            description: Internal server error.
 */
router.patch('/:clubId/:meetingId/changeActiveStatus', authenticate, async (req, res, next) => {
    try {
        const { clubId, meetingId } = req.params;
        const userId = req.user.userId;
        await meetingsChangeActiveStatus(clubId, meetingId, userId);
        res.status(200).json({ message: "Active status changed successfully" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;