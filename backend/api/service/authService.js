const jwt = require('jsonwebtoken');
const Association = require("../../database/model/associationModel");
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({message: 'Access denied. No token provided.'});
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({message: 'Invalid token'});
    }
};

async function ensureOwnership(clubId, userId) {
    const user = await getClubById(clubId)
    const club = await findClubById(clubId)

    if (!user || !club) {
        throw new Error('User or Club is not found')
    }

    const association = await Association.findOne({
        clubId: clubId,
        userId: userId
    }).exec()

    if (!association) {
        throw new Error("Club ownership rejected")
    }

    return association.role;
}


module.exports = {authenticate, ensureOwnership};
