// src/UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '' });

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
    <div>
      <h1>User List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={handleChange}
          required
        />
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username}
            <Link to={`/user/${user.id}`}>
              <button style={{ marginLeft: '10px' }}>View Profile</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
