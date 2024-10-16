const express = require('express');
const multer = require('multer');
const router = express.Router();

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

router.post('/single', upload.single('file'), (req, res, next) => {
    try {
        // Error checking
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        console.log('Uploaded file name:', req.file.originalname);

        res.status(200).send('File uploaded successfully.');
    } catch (error) {
        next(error);
    }
});

module.exports = router;