import React from 'react';
import { Stack, Typography, Button, Card } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import medical from "../assets/Medical_logo.png"
export default function PatientDashboard() {
  const navigate = useNavigate();
  
  // Retrieve patient data from sessionStorage
  
  const patientId = sessionStorage.getItem('patient_id');

  const handleLogout = () => {
    // Clear session storage to log out the user
    
    sessionStorage.removeItem('patient_id');
    navigate('/PatientLogin');  // Redirect to login page
  };

  return (
    <>
    <nav className="bg-gray-800 p-4 flex items-center">
          {/* Logo */}
          <Link to="/" className="mr-2">
            <img src={`${medical}`} alt="Logo" className="h-10" heigh="250px" width="250px"/>
          </Link>
          
        </nav>
    <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center", mt:1 }}>
      <Card sx={{ padding: 4, maxWidth: 500, width: "100%" }}>
        <Typography variant="h5" align="center">
          Hello Newbie, your Patient ID is {patientId}
        </Typography>
        <Stack direction="column" spacing={2} mt={4}>
          <Button variant="contained" onClick={handleLogout} sx={{ backgroundColor: '#26a69a' }}>
            Logout
          </Button>
        </Stack>
      </Card>
    </Stack>
    </>
  );
}
