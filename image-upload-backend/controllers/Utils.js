//import necessary libraries
const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require("@azure/storage-blob");
require('dotenv').config(); // Load environment variables from .env file
const multer = require('multer');

// Function to initialize Azure Blob Service Client using connection string from environment variables
function createContainerClient(containerName) {
    //AZURE_STORAGE_CONNECTION_STRING is the storage string that can be found in your azure storage acc settings->access keys
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName); // Get a client to interact with the specified container
    return containerClient;
}

// Function to upload image to azure storage acc container and ger the url
async function uploadAndGetUrl(req, containerName) {
    const blobName = `${Date.now()}-${req.file.originalname}`; // Get the original name of the uploaded file
    const blockBlobClient = createContainerClient(containerName).getBlockBlobClient(blobName); // Create a block blob client for the uploaded file
    await blockBlobClient.upload(req.file.buffer, req.file.size); // Upload the file buffer to Azure Blob Storage
    const imageUrl = blockBlobClient.url; // Get the URL of the uploaded image
    return imageUrl;
}

// Functions for downloading images
// download
async function download(req, res, containerName) {
    try {
        const blobName = req.params.blobName;
        const sasToken = generateSASToken(blobName, containerName); //call sas generate function
        //ACC_NAME = <your-storage-acc-name> | ACC_KEY = <key1 or key2 in your storage acc (settings->access keys)>
        const downloadUrl = `https://${process.env.ACC_NAME}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

        res.redirect(downloadUrl); // Redirect to URL with SAS token
    } catch (error) {
        console.error("Error generating download link:", error);
        res.status(500).json({ error: "Error generating download link" });
    }
};
// generate sas token for security of data
const generateSASToken = (blobName, containerName) => {
    //ACC_NAME = <your-storage-acc-name> | ACC_KEY = <key1 or key2 in your storage acc (settings->access keys)>
    const sharedKeyCredential = new StorageSharedKeyCredential(process.env.ACC_NAME, process.env.ACC_KEY);

    const sasOptions = {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"), // Use parse method to set permissions
        startsOn: new Date(new Date().valueOf() - 10 * 60 * 1000), // Start 5 minutes ago to prevent timing issues
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Expiry set for 1 hour
    };

    return generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
};

module.exports = { createContainerClient, uploadAndGetUrl, download };
