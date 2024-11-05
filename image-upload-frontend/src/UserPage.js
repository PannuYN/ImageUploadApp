import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Badge, Box, Button, Fab, IconButton, ImageList, ImageListItem, Popover, ThemeProvider, Typography } from '@mui/material';
import ImageViewer from './ImageViewer';
import { CustomButton } from './CommonElements';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import AddIcon from '@mui/icons-material/Add';
import theme from './theme';

function UserPage(props) {
  const { userId } = props; // Get userId from the URL
  const [user, setUser] = useState(null); //for current user
  const [images, setImages] = useState([]); //for uploaded images
  const [profileUpdateTrigger, setProfileUpdateTrigger] = useState(false); //to refresh every time profile pic is changed

  //to show user profile and uploaded images as soon as the page is loaded
  useEffect(() => {
    fetchUser();
    fetchUserImages();
  }, [userId, profileUpdateTrigger]);

  //fetch user data (which includes username and profile_pic, check in db.js)
  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  //fetch images uploaded by the current user
  const fetchUserImages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/images/${userId}`);
      const data = response.data;
      setImages(data.result);
    } catch (error) {
      console.error('Error fetching user images:', error);
      setImages([]);
    }
  };

  //handling profile image change and other images upload (3 steps)

  //1=> reference the icon buttons to related real file inputs which are hidden
  const profileInputRef = useRef(null); //for profile change
  const handlePlusIconClick = () => {
    profileInputRef.current.click();
  };
  const imageFileInputRef = useRef(null); //for image upload
  const handleUploadFabClick = () => {
    imageFileInputRef.current.click();
  };

  //2=> handle images upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleImageUpload(file); //upload altogether with the file change
    }
  };
  const handleImageUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
      await axios.post(`http://localhost:5000/upload/${userId}`, formData);
      fetchUserImages(); //fetch images again to get updated image list
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  //3=> handle profile change
  const [profileImageFile, setProfileImageFile] = useState(null); //to set profile image file in here
  const [profileImagePreview, setProfileImagePreview] = useState(null); //to show preview of profile image in dialog box
  const handleProfileImageFileChange = (e) => { //show preview in dialog box when the file is changed
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));  // Create a preview URL
      setOpenProfilePreview(true);  // Open the dialog box
    }
  };
  const handleProfileUpload = async () => { //upload after the upload button in the dialog box is clicked
    const formData = new FormData();
    formData.append('file', profileImageFile);
    try {
      await axios.post(`http://localhost:5000/upload-profile-pic/${userId}`, formData);
      setProfileUpdateTrigger(prev => !prev); //refresh the page to acknowledge profile change
      setOpenProfilePreview(false); //close the dialog box
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  //for download feature
  const handleDownload = (blobName) => {
    window.open(`http://localhost:5000/download/${blobName}`, '_blank');
  };

  //for delete feature
  const handleDelete = async (blobName, imageId) => {
    try {
      await axios.delete(`http://localhost:5000/images/delete/${imageId}/${blobName}`);
      // Remove the deleted image from the images state
      setImages(prevImages => prevImages.filter(image => image.id !== imageId)); //update images array (since fetchImages() does not work as expected here)
      setOpenUploadedImage(false); //close the dialog box
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  //for dialog box to view images
  const [openProfilePreview, setOpenProfilePreview] = useState(false); //to view profile image preview 
  const [openUploadedImage, setOpenUploadedImage] = useState(false); //to view uploaded images
  //for dialog box only related to uploaded images (not related to profile image)
  const [currentImage, setCurrentImage] = useState({}); //for downloading
  const [blobName, setBlobName] = useState(""); //for deleting
  const handleViewImage = (image, blobName) => {
    setOpenUploadedImage(true);
    setCurrentImage(image);
    setBlobName(blobName);
  };
  //for closing both dialog boxes
  const handleClose = () => {
    setOpenUploadedImage(false);
    setOpenProfilePreview(false);
  };

  //in case if there is no user
  if (!user) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'linear-gradient(90deg, #A7C6ED, #E8D1E3)' }}>
        <Box spacing={2} sx={{ m: 5, p: 3, width: { xs: '80%', md: '70%', lg: '50%' }, margin: 'auto', textAlign: 'center' }}>

          {/* First div for profile and upload image button */}

          {/* Profile and Name */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            <div style={{ display: 'flex', justifyContent: 'start', gap: 5, marginLeft: 10 }}>
              {/* Profile Image */}
              <div style={{ width: 70, height: 70, overflow: 'hidden', position: 'relative' }}>
                {user.profile_pic ?
                  <img
                    src={user.profile_pic}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%'
                    }}
                  />
                  :
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'gray' }}></div>
                }

                {/* Custom "+" Button in Bottom-Right for profile change */}
                <input type="file" ref={profileInputRef} onChange={handleProfileImageFileChange}
                  style={{ display: 'none' }} /> {/* hidden input */}
                <IconButton
                  onClick={handlePlusIconClick}  // Open file input on click
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    backgroundColor: '#1976d2', color: 'white',
                    width: '20px', height: '20px', borderRadius: '50%'
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </div>

              {/* Name */}
              <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                <strong>{user.username}</strong>
              </div>

            </div>

            {/* Upload Image button */}
            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end', marginRight: 10 }}>
              <input type="file" ref={imageFileInputRef} onChange={handleImageFileChange}
                style={{ display: 'none' }} /> {/* hidden input */}
              <Fab variant="extended" size="small" color="#A7C6ED" onClick={handleUploadFabClick} >
                <UploadOutlinedIcon sx={{ mr: 1 }} />
                Upload Image
              </Fab>
            </div>

          </div>

          {/* Second div for image list */}
          <ImageList cols={3} rowHeight={164}>
            {images && images.map((image) => {
              const blobName = image.url.split('/').pop(); // Extract blob name from the URL
              return (
                <ImageListItem key={image.url} sx={{ height: 'auto' }}> {/* Remove height restriction here */}
                  <img
                    srcSet={`${image.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${image.url}?w=164&h=164&fit=crop&auto=format`}
                    alt={image.id}
                    loading="lazy"
                    style={{
                      width: '100%', // Ensure image takes full width
                      height: '100%', // Ensure image takes full height
                      objectFit: 'cover', // Ensure the image covers the area without distortion
                      transition: 'transform 0.3s ease' // Smooth scaling effect
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.7)'} // Slightly scale up
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale
                    onClick={() => handleViewImage(image, blobName)}
                  />
                </ImageListItem>
              );
            })}
          </ImageList>

        </Box>

        {/* dialog box to view uploaded images */}
        <ImageViewer open={openUploadedImage} onClose={handleClose} imageUrl={currentImage.url}>
          <Stack direction="row" spacing={2} sx={{ m: 2, justifyContent: 'flex-end' }}>
            <CustomButton onClick={() => handleDelete(blobName, currentImage.id)} color="error">
              <DeleteOutlinedIcon sx={{ mr: 1 }} /> {/* Add margin to the right for spacing */}
              Delete
            </CustomButton>
            <CustomButton onClick={() => handleDownload(blobName)} color='success'>
              <DownloadOutlinedIcon sx={{ mr: 1 }} /> {/* Add margin to the right for spacing */}
              Download
            </CustomButton>
          </Stack>
        </ImageViewer>

        {/* dialog box to view future profile image */}
        <ImageViewer open={openProfilePreview} onClose={handleClose} imageUrl={profileImagePreview}>
          <Stack direction="row" spacing={2} sx={{ m: 2, justifyContent: 'flex-end' }}>
            <CustomButton onClick={handleClose} color="secondary">
              Cancel
            </CustomButton>
            <CustomButton onClick={handleProfileUpload} color='primary'>
              Upload
            </CustomButton>
          </Stack>
        </ImageViewer>
      </Box>
    </ThemeProvider>
  );
}

export default UserPage;


