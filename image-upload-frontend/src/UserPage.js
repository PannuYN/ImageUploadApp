// src/UserPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserPage = () => {
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
      fetchUserImages();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <h1>Profile Upload</h1>
      <input type="file" onChange={handleProfileImageFileChange} />
      <button onClick={handleProfileUpload}>Upload</button>
      <h2>Profile Picture</h2>
      <img src={user.profile_pic} alt="profile pic" style={{ width: '100px' }} />
      <h1>Image Upload</h1>
      <input type="file" onChange={handleImageFileChange} />
      <button onClick={handleImageUpload}>Upload</button>
      <h2>Uploaded Images:</h2>
      <ul>
        {images.length > 0 && images.map((image, index) => {
          const blobName = image.url.split('/').pop(); // Extract blob name from the URL
          return (
            <div key={index}>
              <img src={image.url} alt={`Uploaded ${index}`} style={{ width: '100px' }} />
              <button onClick={() => handleDownload(blobName)}>Download</button>
              <button onClick={() => handleDelete(blobName, image.id)}>Delete</button>
            </div>
          );
        })}
      </ul>
      {/* You can add more functionalities here, like uploading a profile picture or new images */}
    </div>
  );
};

export default UserPage;
