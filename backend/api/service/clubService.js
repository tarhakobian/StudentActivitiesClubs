const Club = require('../../database/model/clubModel');
const User = require('../../database/model/userModel');
const Association = require('../../database/model/associationModel');

async function getAllClubs() {
    const clubs = await Club.find().exec();
    return clubs.map(club => ({
        id: club._id,
        title: club.title,
        imageUrl: club.imageUrl
    }));
}

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
    let club = await Club.findById(clubId).exec()

    if (!club) {
        throw new Error(`Club with id - ${clubId} doesn't exist`)
    }

    let user = await User.findById(userId).exec();

    if (!user) {
        throw new Error(`User with id - ${userId} doesn't exist`)
    }

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

async function ensureOwnership(clubId, userId) {
    const association = await Association.findOne({
        clubId: clubId,
        userId: userId
    }).exec()

    if (!association) {
        throw new Error("Club ownership rejected")
    }
}


module.exports = {getAllClubs, getClubById, getClubMembers, joinClub};
