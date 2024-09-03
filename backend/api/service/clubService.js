const Club = require('../../database/model/clubModel');
const User = require('../../database/model/userModel');
const Association = require('../../database/model/associationModel');

/** Get all clubs */
async function getAllClubs() {
    const clubs = await Club.find().exec();
    return clubs.map(club => ({
        id: club._id,
        title: club.title,
        imageUrl: club.imageUrl
    }));
}

/** Get a single club by ID */
async function getClubById(id) {
    const club = await Club.findById(id).exec();
    if (!club) {
        throw new Error(`Club with id ${id} is not found`);
    }

    const cabinet = [];

    const userPromises = club.cabinet.map(member => User.findById(member.userId).exec());
    const users = await Promise.all(userPromises);

    const associationPromises = users.map((user, index) => {
        if (!user) {
            throw new Error(`User with id ${club.cabinet[index].userId} is not found`);
        }
        return Association.findOne({
            userId: user._id,
            clubId: club._id
        }).exec();
    });
    const associations = await Promise.all(associationPromises);

    // Build cabinet details
    users.forEach((user, index) => {
        const association = associations[index];
        if (!association) {
            throw new Error(`Association with userId ${user._id} and clubId ${club._id} is not found`);
        }

        cabinet.push({
            name: user.name,
            email: user.email,
            role: association.role
        });
    });

    return {
        title: club.title,
        content: club.content,
        cabinet: cabinet,
        imageUrl: club.imageUrl
    };
}

module.exports = {getAllClubs, getClubById};
