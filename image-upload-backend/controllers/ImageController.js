//import necessary libraries and functions
const {db, queryAsync} = require("../db");
const { createContainerClient, uploadAndGetUrl, download } = require("./Utils");

//assign required constants
const containerName = "images";
const containerClient = createContainerClient(containerName);

//get all uploaded images
exports.getUploadedImages = async (req, res) => {
    try {
        const blobs = containerClient.listBlobsFlat(); // List all blobs in the container
        const imageUrls = []; // Array to store the URLs of the images
        for await (const blob of blobs) { // Iterate over each blob
            imageUrls.push(`${containerClient.getBlockBlobClient(blob.name).url}`); // Add the blob URL to the array
        }
        res.status(200).json(imageUrls); // Respond with the array of image URLs
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).json({ error: 'Error fetching images' }); // Respond with an error message
    }
};

//get an image by id

// Get images by uploaded user
exports.getImagesByUploadedUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Use queryAsync.all to fetch images
        const result = await queryAsync.all('SELECT * FROM images WHERE user_id = ?', [userId]);
        // Check if result is empty
        if (result.length === 0) {
            return res.status(404).json({ result });
        }
        res.status(200).json({ result }); // Respond with the array of image URLs
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).json({ error: 'Error fetching images' }); // Respond with an error message
    }
};


//upload image
exports.uploadImage = async (req, res) => {
    const userId = req.params.userId; // Get the user ID from the URL
    if (!req.file) //check the existence of the file in the request
        return res.status(400).json({ error: 'No file uploaded.' });
    try {
        const imageUrl = await uploadAndGetUrl(req, containerName); // Get the URL of the uploaded image
        db.run("insert into images (url, user_id) values (?, ?)", [imageUrl, userId], function (err) {
            if (err) {
                console.error('Error uploading image:', err.message);
                return res.status(500).json({ error: 'Error uploading image.' });
            }
            res.status(200).json({ imageUrl }); // Respond with the image URL
        });
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).json({ error: 'Error uploading the image' }); // Respond with an error message
    }
};

//download image
exports.downloadImage = async (req, res) => {
    await download(req, res, containerName);
}

//delete image
exports.deleteImage = async (req, res) => {
    const blobName = req.params.blobName;
    const imageId = req.params.imageId;
    const blockBlobClient = createContainerClient(containerName).getBlockBlobClient(blobName);
    try {
        await blockBlobClient.delete(); // Attempt to delete the file
        db.run('delete from images where id = ?', [imageId], (err, result) => {
            if (err)
                return res.status(500).json({ error: 'Error deleting image.' });
            return res.status(200).json({ result: 'Image is deleted.' });
        })
    }
    catch (error) {
        console.error("An error occurred during deletion:", error.message);
    }
}
