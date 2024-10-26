const express = require('express');
const router = express.Router();
const {moderateChat} = require('../service/openAiService')

// const upload = multer({ storage: storage });

router.get('/moderate/:content', async (req,res,next)=>{
    const content = req.params['content']
    const flagged = moderateChat(content)

    res.status(200).send(flagged)
})

module.exports = router