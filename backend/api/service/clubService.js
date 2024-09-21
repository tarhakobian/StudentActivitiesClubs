const Club = require('../../database/model/clubModel');
const User = require('../../database/model/userModel');
const Association = require('../../database/model/associationModel');
const Announcement = require('../../database/model/announcementModel')
const {findUserById} = require('./userService')
const {ensureOwnership} = require('./authService')


async function findClubById(clubId) {
    const club = await Club.findById(clubId).exec()
    if (!club) {
        throw new Error(`Club with id - ${clubId} doesn't exist`)
    }
    return club;
}

async function getAllClubs() {
    return await Club.find()
        .select('_id title imageUrl')
        .exec();
}

async function getClubById(id) {
    const club = await findClubById(id)
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
        clubId: club._id,
        title: club.title,
        content: club.content,
        cabinet: cabinet,
        imageUrl: club.imageUrl
    }
}

async function getClubMembers(clubId, userId) {
    await ensureOwnership(clubId, userId)

    const clubAssociations = await Association.find({clubId: clubId}).exec()

    const userPromises = clubAssociations.map(association =>
        User.findOne({_id: association.userId}).exec())

    const users = await Promise.all(userPromises)

    return users.map((user, index) => {
        return {
            userId: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: clubAssociations[index].role
        }
    })
}


async function joinClub(clubId, userId) {
    // Warning : Unused variable club, needs for checking teh existence of the club with provided clubId
    let club = await findClubById(clubId)
    let user = await findUserById(userId);

    const duplicateAssociation = await Association.findOne({
        clubId: clubId,
        userId: userId
    }).exec()

    if (duplicateAssociation) {
        throw new Error("Duplicate association")
    }

    const association = await new Association({
        clubId: clubId,
        userId: userId,
        role: "Member"
    }).save()


    user.associations.push(association)

    await user.save()
}

async function leaveClub(clubId, userId) {
    const role = await ensureOwnership(clubId, userId)

    if (role !== 'Member') {
        throw new Error('Only users with role Member can leave the club')
    }

    const association = await Association.findOneAndDelete({clubId: clubId, userId: userId}).exec()

    const user = await findUserById(userId);
    user.associations = user.associations.filter(id => id.toString() !== association._id.toString());

    await user.save()
}

module.exports = {
    findClubById,
    getAllClubs,
    getClubById,
    getClubMembers,
    joinClub,
    leaveClub,
};
