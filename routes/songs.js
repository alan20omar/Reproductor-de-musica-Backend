const express = require('express');
const router = express.Router();
// for parsing multipart/form-data // use upload.single('<file>')
const multer = require('multer');
// const upload = multer({ dest: './media/songs/' }); // Save the file
const upload = multer();

// Controllers
const songController = require('../controllers/songConroller');

// Routes /songs...

// Data songs 
router.get('/', songController.availableDataSongList_get);
router.post('/', upload.single('song'), songController.createSong_post);
router.get('/:id', songController.songData_get);
router.delete('/:id', songController.deleteSong_delete);
router.patch('/:id', upload.single('image'), songController.updateSong_patch);
// router.post('/prueba', songController.prueba);

// Files songs
router.get('/:id/file', songController.songFile_get);
router.get('/:id/image', songController.songImage_get);

module.exports = router;