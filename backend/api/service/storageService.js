
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../errors/errors');
require('dotenv').config();  // Load environment variables from .env file


const s3Client = new S3Client({
    region: 'us-east-1', // Required, though ignored by DigitalOcean Spaces
    endpoint: process.env.DO_SPACES_ENDPOINT, // DigitalOcean Spaces endpoint
    credentials: {
        accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
    },
});

const uploadFileToSpace = async (file, directory = '') => {
    const fileExtension = file.originalname.split('.').pop();
    // Generate a unique filename using UUID and append the original file extension
    const fileName = `${uuidv4()}.${fileExtension}`;
    const s3Key = `${fileName}`;

    const params = {
        Bucket: process.env.DO_SPACES_BUCKET,  
        Key: `${s3Key}`,  
        Body: file.buffer,  
        ContentType: file.mimetype,  
        ACL: 'public-read', 
    };

    try {
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);

        const url = `${process.env.DO_SPACES_ENDPOINT}/${params.Bucket}/${s3Key}`;
        return url; // Return the accessible URL

        // return response // URL of the uploaded file in DigitalOcean Spaces
    } catch (error) {
        console.error('Error uploading file to DigitalOcean Spaces:', error);
        throw new AppError('File upload failed');
    }
};

module.exports = { uploadFileToSpace };