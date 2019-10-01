const express = require('express');
const router = express.Router();

router.post('/receive', (req,res,next) => {
    var content = req.nody.comments;
    content = JSON.parse(content);
    console.log(content.akhil);
    res.send();
});

module.exports = router;