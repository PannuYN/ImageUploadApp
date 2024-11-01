const express = require('express');
const multer = require('multer');
const userController = require('./controllers/UserController');
const imageController = require('./controllers/ImageController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); //for temporary upload on memory storage

//images table routes
router.post('/upload/:userId', upload.single('file'), imageController.uploadImage); // Route to handle other images upload
router.get('/images', imageController.getUploadedImages);  // Route to fetch all uploaded images
router.get('/download/:blobName', imageController.downloadImage); // Route to download image
router.delete('/images/delete/:imageId/:blobName', imageController.deleteImage) // Route to delete image
router.get('/images/:userId', imageController.getImagesByUploadedUser) // Route to fetch images by the user

//users table routes
router.get('/users', userController.getAllUsers);  // Route to fetch all uploaded images
router.post('/users', userController.createNewUser);  // Route to create new user
router.get('/users/:userId', userController.getUser);  // Route to fetch user by id
router.post('/upload-profile-pic/:userId', upload.single('file'), userController.uploadProfilePicture); // Route to handle profile picture upload
router.get('/profile/download/:blobName', userController.downloadProfilePic); // Route to download profile picture

module.exports = router;
