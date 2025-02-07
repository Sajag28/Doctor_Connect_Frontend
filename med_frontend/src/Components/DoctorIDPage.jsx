import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import medical from "../assets/Medical_logo.png"
export default function DoctorIDPage() {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('');
  const [doctorId, setDoctorId] = useState('');

  useEffect(() => {
    const storedName = sessionStorage.getItem('doctor_name');
    const storedId = sessionStorage.getItem('doctor_id');
    
    if (!storedName || !storedId) {
      alert("No doctor information found. Redirecting to registration page.");
      navigate('/register');
      return;
    }
    
    setDoctorName(storedName);
    setDoctorId(storedId);
  }, [navigate]);

  return (<>
   <nav className="bg-gray-400 p-2 flex items-center">
      {/* Logo */}
      <Link to="/" className="mr-4">
        <img src={`${medical}`} alt="Logo" className="h-5" heigh="250px" width="250px"/>
      </Link>
      
    </nav>
    <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
      <Card sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h4">Hey, Dr. {doctorName}!</Typography>
        <Typography variant="h6">Your Doctor ID is: {doctorId}</Typography>
      </Card>
    </Stack>
    </>
  );
}
