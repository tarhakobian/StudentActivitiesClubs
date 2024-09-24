const Association = require("../../database/model/associationModel");
const Club = require("../../database/model/clubModel");
const User = require("../../database/model/userModel");
// const { findUserById } = require('./userService');
// const { findClubById } = require('./clubService');

async function ensureOwnership(clubId, userId) {
    const user = await User.findById(userId).exec();
    const club = await Club.findById(clubId).exec();

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


module.exports = { ensureOwnership };
