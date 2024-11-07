
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();  // Load environment variables from .env file


const s3 = new AWS.S3({
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
    endpoint: new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT),  
    region: 'us-east-1',  // This can be any valid region; it's required but ignored by DO Spaces
    signatureVersion: 'v4',  // DigitalOcean requires signature version 4
});

const uploadFileToSpace = async (file, directory = '') => {
    const fileExtension = file.originalname.split('.').pop();
    // Generate a unique filename using UUID and append the original file extension
    const fileName = `${uuidv4()}.${fileExtension}`;
    const s3Key = `${directory}/${fileName}`;

    const params = {
        Bucket: process.env.DO_SPACES_BUCKET,  
        Key: s3Key,  
        Body: file.buffer,  
        ContentType: file.mimetype,  
        ACL: 'public-read', 
    };

    try {

        const data = await s3.upload(params).promise();
        return data.Location;  // URL of the uploaded file in DigitalOcean Spaces
    } catch (error) {
        console.error('Error uploading file to DigitalOcean Spaces:', error);
        throw new Error('File upload failed');
    }
};

module.exports = { uploadFileToSpace };
