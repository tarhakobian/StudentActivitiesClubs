const User = require("../../database/model/userModel");
const Association = require('../../database/model/associationModel')
const Notification = require('../../database/model/notificationModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { NotFoundError, DuplicateUserError, PasswordValidationError, BadRequestError } = require("../errors/errors");

async function findUserById(userId) {
    const user = await User.findById(userId).exec()

    if (!user) {
        throw new NotFoundError(`User with id - ${userId} doesn't exist`)
    }
    return user;
}

async function register(email, password, name) {
    if (!email || !password || !name) {
        throw new BadRequestError('Email, password, and name are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new DuplicateUserError(`Failed to register user with email - ${email}`)
    }

    if (password.length < 5) {
        throw new BadRequestError("Invalid password input")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
        email: email,
        password: hashedPassword,
        name: name,
        associations: [],
    });

    await newUser.save();

    return newUser._id
}

async function login(email, password) {
    if (!email || !password) {
        throw new BadRequestError('Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError(`User not found with this email - ${email}`)
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw new PasswordValidationError("Password doesnt match")
    }

    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

async function getUserProfileData(userId, targetUserId) {
    let loggedInUser = await User.findOne({ _id: userId }).exec();
    let targetUser = await User.findOne({ _id: targetUserId }).exec();

    if (userId == targetUserId) {
        
    }

    if (!loggedInUser) {
        throw new NotFoundError(`User not found with id - ${userId}`);
    }

    if (!targetUser) {
        throw new NotFoundError(`User not found with id - ${targetUserId}`);
    }

    async function findAssociatedClubIds(user) {
        let userAssociationsPromises = user.associations.map(associaition => Association.findOne({ _id: associaition._id }));

        let userAssociations = await Promise.all(userAssociationsPromises);

        userAssociations = userAssociations.map(association => association.clubId.toString());
        return userAssociations;
    }
    
    //Building associations array with clubIds for user and target user
    let userAssociations = await findAssociatedClubIds(loggedInUser);
    let targetUserAssociations = await findAssociatedClubIds(targetUser);

    let commonClubIds = (targetUserAssociations && userAssociations && targetUserAssociations.length > 0 && userAssociations.length > 0)
        ? targetUserAssociations.filter(value => userAssociations.includes(value)) : []

    return {
        userId: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        profileImageUrl: targetUser.profileImageUrl,
        commonClubIds: commonClubIds
    }
}

async function contactRequest(userId, targetUserId) {
    const user = await User.findById(userId).exec();
    const targetUser = await User.findById(targetUserId).exec();
    
    if (!user) {
        throw new NotFoundError(`User not found with id - ${userId}`);
    }
    if (!targetUser) {
        throw new NotFoundError(`User not found with id - ${targetUserId}`);
    }

    const BASE_URL = process.env.BASE_URL;

    const message = `📩 ${user.name} has requested to get in contact with you.\n\nClick to view their profile: ${BASE_URL}users/${userId}`;

    const notification = new Notification({
        recipient: targetUserId,
        sender: userId,
        message,
        entityType: 'ContactRequest'
    });

    const savedNotification = await notification.save();

    return savedNotification._id;
}

module.exports = { register, login, getUserProfileData, findUserById, contactRequest }