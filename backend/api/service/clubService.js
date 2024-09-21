const Club = require('../../database/model/clubModel');
const User = require('../../database/model/userModel');
const Association = require('../../database/model/associationModel');
const Announcement = require('../../database/model/announcementModel')

async function getAllClubs() {
    return await Club.find()
        .select('_id title imageUrl')
        .exec();
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

async function leaveClub(clubId, userId) {
    const role = await ensureOwnership(clubId, userId)

    if (role !== 'Member') {
        throw new Error('Only users with role Member can leave the club')
    }

    const association = await Association.findOneAndDelete({clubId: clubId, userId: userId}).exec()

    const user = await User.findById(userId).exec();
    user.associations = user.associations.filter(id => id.toString() !== association._id.toString());

    await user.save()
}

async function getAllAnnouncements(clubId, userId) {
    await ensureOwnership(clubId, userId)

    const announcements = await Announcement.find({clubId: clubId, isActive: true})
        .select('date title content attachments') // Specify fields to include
        .sort({date: -1});

    return announcements.map(announcement => ({
        id: announcement._id,
        date: announcement.date,
        title: announcement.title,
        content: announcement.content,
        attachments: announcement.attachments
    }));
}

async function createAnnouncement(announcementDetails) {
    const role = await ensureOwnership(announcementDetails['clubId'], announcementDetails['authorId'])
    if (role === 'MEMBER') {
        throw new Error("Unauthorized action")
    }

    const announcement = await new Announcement(announcementDetails).save();

    return announcement._id;
}


async function deleteAnnouncement(announcementId, userId) {
    const announcement = await Announcement.findById(announcementId).exec()
    const clubId = announcement.clubId
    const role = await ensureOwnership(clubId, userId)

    if (role === 'Member') {
        throw new Error("Unauthorized")
    }

    await Announcement.deleteOne(announcement._id)
}

async function editAnnouncement(userId, announcementId, body) {
    const announcement = await Announcement.findById(announcementId).exec();

    if (!announcement) {
        throw new Error("Announcement not found");
    }

    const clubId = announcement.clubId;

    const role = await ensureOwnership(clubId, userId);

    if (role === 'Member') {
        throw new Error("Unauthorized");
    }

    announcement.title = body.title || announcement.title;
    announcement.content = body.content || announcement.content;
    announcement.attachments = body.attachments || announcement.attachments;
    announcement.lastUpdatedAt = new Date();
    announcement.lastUpdatedBy = userId;

    await announcement.save();

    return {message: "Announcement updated successfully", announcement};
}

async function announcementsChangeActiveStatus(announcementId, userId) {
    const announcement = await Announcement.findById(announcementId).exec();

    if (!announcement) {
        throw new Error("Announcement not found");
    }

    const clubId = announcement.clubId;

    const role = await ensureOwnership(clubId, userId);

    if (role === 'Member') {
        throw new Error("Unauthorized");
    }

    announcement.isActive = !announcement.isActive

    await announcement.save();
}


async function ensureOwnership(clubId, userId) {
    const user = await User.findById(userId).exec()
    const club = await Club.findById(clubId).exec()

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


module.exports = {
    getAllClubs,
    getClubById,
    getClubMembers,
    joinClub,
    leaveClub,
    createAnnouncement,
    deleteAnnouncement,
    editAnnouncement,
    getAllAnnouncements,
    announcementsChangeActiveStatus
};
