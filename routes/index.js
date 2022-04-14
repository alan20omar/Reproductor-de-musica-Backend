'use strict'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/songs');
});

module.exports = router;