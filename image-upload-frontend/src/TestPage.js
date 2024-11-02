import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Button, ImageList, ImageListItem, Popover, Typography } from '@mui/material';
import ImageViewer from './ImageViewer';
import { CustomButton } from './CommonElements';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

function TestPage() {
  const { userId } = useParams(); // Get userId from the URL
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [profileUpdateTrigger, setProfileUpdateTrigger] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchUserImages();
  }, [userId, profileUpdateTrigger]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserImages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/images/${userId}`);
      const data = response.data;
      setImages(data.result);
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };
  //console.log(images);

  const fetchProfileImage = async () => {

  }

  const [imageFile, setImageFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const handleProfileImageFileChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const handleProfileUpload = async () => {
    const formData = new FormData();
    formData.append('file', profileImageFile);
    try {
      await axios.post(`http://localhost:5000/upload-profile-pic/${userId}`, formData);
      setProfileUpdateTrigger(prev => !prev);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
      await axios.post(`http://localhost:5000/upload/${userId}`, formData);
      fetchUserImages();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDownload = (blobName) => {
    window.open(`http://localhost:5000/download/${blobName}`, '_blank');
  };

  const handleDelete = async (blobName, imageId) => {
    try {
      await axios.delete(`http://localhost:5000/images/delete/${imageId}/${blobName}`);
      // Remove the deleted image from the images state
      setImages(prevImages => prevImages.filter(image => image.id !== imageId));
      setOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  //for dialog box to view image
  const [open, setOpen] = React.useState(false);
  const [currentImage, setCurrentImage] = useState({});
  const [blobName, setBlobName] = useState("");
  const handleClickOpen = (image, blobName) => {
    setOpen(true);
    setCurrentImage(image);
    setBlobName(blobName);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Box spacing={2} sx={{ m: 2, width: { xs: '100%', md: '100%', lg: '40%' }, margin: 'auto', textAlign: 'center' }}>

        {/* First Stack for Profile and Name */}
        <Stack direction="row" spacing={2} sx={{ m: 2 }}>
          {/* Profile Image */}
          <div style={{ width: 70, height: 70, borderRadius: '50%', overflow: 'hidden' }}>
            <img
              src={user.profile_pic}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Name */}
          <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
            <strong>{user.username}</strong>
          </div>
        </Stack>

        {/* Second Stack for images */}
        <ImageList sx={{ width: 500 }} cols={3} rowHeight={164}> {/* Set a fixed rowHeight */}
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
                  onClick={() => handleClickOpen(image, blobName)}
                />
              </ImageListItem>
            );
          })}
        </ImageList>

      </Box>

      <ImageViewer open={open} onClose={handleClose} imageUrl={currentImage.url}>
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
    </div>
  );
}

export default TestPage;


