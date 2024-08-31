const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get("/", (req, res, next) => {
    const filePath = path.join('./database/' + 'database.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            res.status(200).json(jsonData);
        } catch (e) {
            console.log(e)
            res.status(400).send('Invalid JSON format');
        }
    });
})

module.exports = router;