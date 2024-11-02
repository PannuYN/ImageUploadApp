// src/components/CommonElements.js
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';

// Example of a reusable component
export const CenteredBox = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      ...props.sx, // Allows additional styling props
    }}
  >
    {children}
  </Box>
);

// Another example of a reusable Button
export const CustomButton = ({ children, onClick, color, ...props }) => (
    <Button variant="contained" onClick={onClick} color={color} {...props}>
      {children}  {/* Render children here instead of text */}
    </Button>
  );

// Export other common components or elements as needed
