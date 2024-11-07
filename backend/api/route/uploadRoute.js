const express = require('express');
const multer = require('multer');
const { uploadFileToSpace } = require('../service/s3Service');  
const router = express.Router();

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 *  paths:
 *    /upload/single:
 *      post:
 *        tags:
 *          - Upload
 *        summary: Upload a single file
 *        description: This endpoint allows users to upload a single file using multipart/form-data.
 *        requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                type: object
 *                properties:
 *                  file:
 *                    type: string
 *                    format: binary
 *                    description: The file to be uploaded
 *        responses:
 *          200:
 *            description: File uploaded successfully
 *          400:
 *            description: No file uploaded
 *          500:
 *            description: Internal server error
 */

router.post('/single', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // sets upload directory
        const directory = 'upload';
        // Upload file to DigitalOcean Spaces and get the URL
        const fileUrl = await uploadFileToSpace(req.file, directory);

        // Send the URL back in the response
        res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: fileUrl
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        next(error);
    }
});

module.exports = router;
