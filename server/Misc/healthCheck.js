const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Service Of api is OK');
});

module.exports = router;