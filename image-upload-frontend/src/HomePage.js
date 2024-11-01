import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/upload', formData);
      fetchImages();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/images');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleDownload = (blobName) => {
    window.open(`http://localhost:5000/download/${blobName}`, '_blank');
  };

  const handleDelete= async (blobName, url) => {
    try {
      await axios.delete(`http://localhost:5000/images/delete/${url}/${blobName}`);
      fetchImages();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);
console.log(images);
  return (
    <div>
      <h1>Image Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <h2>Uploaded Images:</h2>
      <div>
        {images.map((url, index) => {
          //const url = image.url;
          const blobName = url.split('/').pop(); // Extract blob name from the URL
          return (
            <div key={index} style={{ margin: '10px' }}>
              <img src={url} alt={`uploaded-img-${index}`} style={{ width: '200px', border: '1px solid #ccc' }} />
              <button onClick={() => handleDownload(blobName)}>Download</button>
              <button onClick={() => handleDelete(blobName, url)}>Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
