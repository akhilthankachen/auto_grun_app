const express = require('express');
const router = express.Router();

router.post('/receive', (req,res,next) => {
    console.log(req);
    res.send();
});

module.exports = router;