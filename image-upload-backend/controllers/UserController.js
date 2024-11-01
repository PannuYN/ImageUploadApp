//import necessary libraries and functions
const { uploadAndGetUrl, upload, download, createContainerClient } = require("./Utils");
const { db, queryAsync } = require('../db')

//assign required constants
const containerName = "profilepics";

//get all users
exports.getAllUsers = async (req, res) => {
    try {
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) {
                console.error("Error fetching users:", err);
                res.status(500).json({ error: 'Error fetching users' });
            } else {
                res.status(200).json(rows);
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
};

//get user by id
exports.getUser = (req, res) => {
    const { userId } = req.params;

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ error: 'Error fetching user.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(row);
    });
};

//add a new user
exports.createNewUser = async (req, res) => {
    const { username } = req.body; // Get username from request body  
    // Validate that username is provided
    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    try {
        db.run("INSERT INTO users (username) VALUES (?)", [username], function (err) {
            if (err) {
                console.error('Error creating user:', err.message);
                return res.status(500).json({ error: 'Error creating user.' });
            }
            // `this.lastID` is only accessible within this callback
            res.status(201).json({ id: this.lastID, username });
        });
    } catch (error) {
        console.error('Unexpected error:', error.message);
        res.status(500).json({ error: 'Unexpected error while creating user.' });
    }
};

// Upload to set profile picture
exports.uploadProfilePicture = async (req, res) => {
    const userId = req.params.userId; // Get the user ID from the URL
    if (!req.file) // Check the existence of the file in the request
        return res.status(400).json({ error: 'No file uploaded.' });
    try {
        // Upload the new profile picture and get its URL
        const imageUrl = await uploadAndGetUrl(req, containerName);
        // Retrieve the current profile picture URL from the database
        const currentProfilePic = await queryAsync.get('SELECT profile_pic FROM users WHERE id = ?', [userId]);
        // Check if a current profile picture exists
        if (currentProfilePic && currentProfilePic.profile_pic) {
            const encodedBlobName = currentProfilePic.profile_pic.split('/').pop(); // Extract the encoded blob name
            const blobName = decodeURIComponent(encodedBlobName); // Decode the blob name
            const blockBlobClient = createContainerClient(containerName).getBlockBlobClient(blobName);
            await blockBlobClient.delete(); // Attempt to delete the old profile picture
        }
        // Update the user's profile_pic in the database
        db.run("UPDATE users SET profile_pic = ? WHERE id = ?", [imageUrl, userId], function (err) {
            if (err) {
                console.error('Error updating profile picture:', err.message);
                return res.status(500).json({ error: 'Error updating profile picture.' });
            }
            res.status(200).json({ imageUrl }); // Respond with the new image URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading the image.' });
    }
};


//download profile picture
exports.downloadProfilePic = async (req, res) => {
    await download(req, res, containerName);
}