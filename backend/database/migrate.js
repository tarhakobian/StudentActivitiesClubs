const data = require("../../frontend/react/src/data/data");
const Club = require('./model/clubModel');
const User = require('./model/userModel');
const Association = require("./model/associationModel");

const saveData = async () => {
    for (const club of data) {
        const title = club.title;
        const cabinet = new Map([
            [club.president, "President"],
            [club.vicePresident, "VicePresident"],
            [club.advisor, "Advisor"]
        ]);


        console.log(`Club Title: ${title}`);
        console.log(`Cabinet Members:`);

        try {
            const clubEntity = await Club.findOne({title: title});
            if (clubEntity) {
                for (const member of cabinet.keys()) {
                    const user = new User({
                        name: member.name,
                        email: `${member.name.replace(/\s+/g, "")}@student.glendale.edu`
                    });

                    try {
                        const savedUser = await user.save();

                        const association = new Association({
                            userId: savedUser._id,
                            clubId: clubEntity._id,
                            role: cabinet.get(member)
                        })

                        const savedAssociation = await association.save()

                        savedUser.associations.push(association)
                        await savedUser.save()


                        console.log(`${savedUser.name} , ${savedUser.email} , ${savedAssociation.role}`);
                    } catch (error) {
                        console.error(`Error saving user ${member.name}:`, error);
                    }
                }
            } else {
                console.log(`No club found with title: ${title}`);
            }
        } catch (error) {
            console.error(`Error finding club with title: ${title}`, error);
        }

        console.log(`----------------------`);
        console.log(`----------------------`);
        console.log(`----------------------`);
    }
};

// Call the function to execute
saveData().catch(error => {
    console.error('Error in saveData:', error);
});
