const User = require("../../database/model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(email, password, name) {
    // Check if user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new Error(`Failed to register user with email - ${email}`)
    }

    if (password.length < 6) {
        throw new Error("Invalid password input")
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
    const user = await User.findOne({email});
    if (!user) {
        throw new Error(`User not found with this email - ${email}`)
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw new Error("Password doesnt match")
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token
}

module.exports = {register, login}

