import logo from './logo.svg';
import './App.css';
import HomePage from './HomePage';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './TestPage';
import UserList from './UserList';
import UserPage from './UserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Define the route for the Home Page */}
        <Route path='/users' element={<UserList />} />
        <Route path="/user/:userId" element={<UserPage />} />
        <Route path='/test' element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
