import logo from './logo.svg';
import './App.css';
import HomePage from './HomePage';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './TestPage';
import UserList from './UserList';
import UserPage from './UserPage';
import theme from './theme';
import { ThemeProvider } from '@mui/material';

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path='/' element={<UserList />} />
        <Route path="/user/:userId" element={<UserPage />} />
        <Route path='/test/:userId' element={<TestPage />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
