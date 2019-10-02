const express = require('express');
const router = express.Router();

router.post('/receive', (req,res,next) => {
    var content = req.body.comments;
    content = JSON.parse(content);
    content.number = req.body.sender;
    console.log(content);
    res.send();
});

module.exports = router;