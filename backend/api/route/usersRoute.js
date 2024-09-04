const express = require('express');
const {register, login} = require('../service/userService')

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const email = req.query.email
    const password = req.query.password
    const name = req.query.name
    try {
        const jwtToken = await register(email, password, name)
        res.status(200).json(jwtToken);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
});

// Login User
router.post('/login', async (req, res) => {
    const email = req.query.email
    const password = req.query.password

    let token

    try {
        token = await login(email, password)
    } catch (error) {
        res.status(400).json({"message": "Login not successful"})
    }

    res.status(200).send(token)
});

module.exports = router;
