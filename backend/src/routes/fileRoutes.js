const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const fileController = require('../controllers/fileController');

router.post('/upload', upload.single('file'), fileController.uploadFile);

module.exports = router;
