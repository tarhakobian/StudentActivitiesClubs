const User = require("../../database/model/userModel");
const Association = require('../../database/model/associationModel')
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
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new DuplicateUserError(`Failed to register user with email - ${email}`)
    }

    if (password.length < 6) {
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
    let user = await User.findOne({ _id: userId }).exec();
    let targetUser = await User.findOne({ _id: targetUserId }).exec();

    if (!user) {
        throw new NotFoundError(`User not found with id - ${userId}`);
    }

    if (!targetUser) {
        throw new NotFoundError(`User not found with id - ${targetUserId}`);
    }


    //Building associations array with clubIds for user
    let userAssociationsPromises = user.associations.map(associaition => Association.findOne({ _id: associaition._id }));

    let userAssociations = await Promise.all(userAssociationsPromises)

    userAssociations = userAssociations.map(association => association.clubId.toString())

    //Building associations array with clubIds for targetUser
    let targetUserAssociationsPromises = targetUser.associations.map(associaition => Association.findOne({ _id: associaition._id }));

    let targetUserAssociations = await Promise.all(targetUserAssociationsPromises)

    targetUserAssociations = targetUserAssociations.map(association => association.clubId.toString())

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

module.exports = { register, login, getUserProfileData, findUserById }

