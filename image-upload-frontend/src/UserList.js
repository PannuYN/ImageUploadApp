// src/UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Button, Grid2, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';
import UserPage from './UserPage';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '' });
  const [userId, setUserId] = useState(''); //to pass to UserPage

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setNewUser({ username: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/users', newUser);
      setNewUser({ username: '' }); // Reset form
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 item size={{ xs: 12, sm: 12, md: 9, lg: 4 }}>
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h1" gutterBottom align="center">
            User List
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
            <TextField
              variant="outlined"
              placeholder="Username"
              value={newUser.username}
              onChange={handleChange}
              required
              margin="normal"
            />
            <Button variant="contained" color="primary" type="submit">
              Add User
            </Button>
          </form>
          <List>
            {users.map(user => (
              <ListItem key={user.id} divider>
                <ListItemText primary={user.username} />

                <Button variant="outlined" color="secondary" style={{ marginLeft: '10px' }}
                  onClick={() => setUserId(user.id)}>
                  View Profile
                </Button>

              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
        <UserPage userId={userId} />
      </Grid2>
    </Grid2>
  );
};

export default UserList;
