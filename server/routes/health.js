const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Service OK');
});

module.exports = router;