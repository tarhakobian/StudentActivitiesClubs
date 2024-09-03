const data = require("./data");
const Club = require('./model/clubModel');
const User = require('./model/userModel');
const Association = require("./model/associationModel");

const saveData = async () => {

    for (const dataEntry of data) {

        //Save the club
        let club = await new Club({
            title: dataEntry.title,
            content: dataEntry.content,
            cabinet: [],
            imageUrl: dataEntry.imageUrl
        }).save()

        //Map of cabinet members to their position
        const title = dataEntry.title;
        const cabinet = new Map([
            [dataEntry.president, "President"],
            [dataEntry.vicePresident, "VicePresident"],
            [dataEntry.advisor, "Advisor"]
        ]);

        console.log(`Club Title: ${title}`);
        console.log(`Cabinet Members:`);

        try {
            for (const member of cabinet.keys()) {
                //Save the user
                const user = await new User({
                    name: member.name,
                    email: `${member.name.replace(/\s+/g, "")}@student.glendale.edu`
                }).save()

                //Add user to cabinet
                club.cabinet.push({
                    userId: user._id,
                    role: cabinet.get(member)
                })

                club = await club.save()

                //Create association between club and user
                const association = await new Association({
                    userId: user._id,
                    clubId: club._id,
                    role: cabinet.get(member)
                }).save()

                user.associations.push(association)

                await user.save()

                console.log(`${user.name} , ${user.email} , ${association.role}`);
            }
        } catch
            (error) {
            console.log(error);
        }

        console.log(`----------------------`);
        console.log(`----------------------`);
        console.log(`----------------------`);
    }
}

saveData().catch(error => {
    console.error('Error in saveData:', error);
});
