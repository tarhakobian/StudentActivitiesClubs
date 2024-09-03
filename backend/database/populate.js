const mongoose = require('../config/databaseConfig'); // Adjust the path as necessary
const User = require('./model/userModel');
const Association = require('./model/associationModel');

const usersData = [
    {name: 'Alice Johnson', email: 'alice@example.com'},
    {name: 'Bob Smith', email: 'bob@example.com'},
    {name: 'Carol White', email: 'carol@example.com'},
    {name: 'David Brown', email: 'david@example.com'},
    {name: 'Emma Davis', email: 'emma@example.com'},
];

const associationsData = [
    {club_id: '66d289880d75ba9399851f13', role: 'President'},
    {club_id: '66d289880d75ba9399851f13', role: 'Vice President'},
    {club_id: '66d289880d75ba9399851f13', role: 'Treasurer'},
    {club_id: '66d289880d75ba9399851f13', role: 'Secretary'},
    {club_id: '66d289880d75ba9399851f13', role: 'Member'},
];

async function seedDatabase() {
    try {

        const users = await User.insertMany(usersData);
        console.log('Users created:', users);

        // Map associations to corresponding users
        const associationsToInsert = users.map((user, index) => {
            return {
                ...associationsData[index],
                userId: user._id,
            };
        });

        const associations = await Association.insertMany(associationsToInsert);
        console.log('Associations created:', associations);

        for (let i = 0; i < users.length; i++) {
            await User.findByIdAndUpdate(users[i]._id, {
                $push: {associations: associations[i]._id},
            });
        }

        console.log('Database seeded successfully!');
        process.exit(0); // Exit the script
    } catch (error) {
        console.error('Error seeding the database:', error);
        process.exit(1);
    }
}

const execute = async () => {
    await seedDatabase();
}

execute().then(console.log('---------------------------------------'))
