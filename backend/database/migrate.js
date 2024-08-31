const data = require('../../forntend/static/js/data')
const Club = require('./model/clubModel')

data.forEach(club => {
    let title = club.title;
    let content = club.content
    let cabinet = [club.president,club.vicePresident,club.advisor];
    let imageUrl = club.imageUrl;


    new Club({title:title,content:content,cabinet:cabinet,imageUrl:imageUrl}).save().then(value => console.log(value));
})