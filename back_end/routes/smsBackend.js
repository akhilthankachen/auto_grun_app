const express = require('express');
const router = express.Router();

router.post('/receive', (req,res,next) => {
    var content = req.body.comments;
    content = JSON.parse(content);
    console.log(content.akhil);
    res.send();
});

module.exports = router;