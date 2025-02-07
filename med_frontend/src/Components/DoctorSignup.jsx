import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { TextField, InputAdornment, IconButton, MenuItem } from "@mui/material";
import { Visibility, VisibilityOff, Email, Person } from "@mui/icons-material";
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import reg_doc from "../assets/registerdoctor.jpg";
import Slide from '@mui/material/Slide';

import medical from "../assets/Medical_logo.png"
const theme = createTheme({
  components: {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
});

export default function DoctorRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    specialization: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    const requestData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      specialization: formData.specialization
    };
  
    try {
      const response = await fetch('http://localhost:8000/patients/doctor/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
  
      const data = await response.json();
      if (response.ok) {
        // Storing name and doctor_id in sessionStorage
        sessionStorage.setItem('doctor_id', data.doctor_id);
        sessionStorage.setItem('doctor_name', data.name);
  
       
        navigate('/DoctorIDPage'); // Redirect after successful registration
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };
  
  return (
    <>
    <nav className="bg-gray-800 p-4 flex items-center">
          {/* Logo */}
          <Link to="/" className="mr-4">
            <img src={`${medical}`} alt="Logo" className="h-10" heigh="250px" width="250px"/>
          </Link>
          
        </nav>
    <ThemeProvider theme={theme}>
      <Stack>
        <Stack
          direction={{ xs: 'column', sm: 'column', md: 'row' }}
          spacing={6}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mt: '1rem',
            mx: 'auto',
            width: "80%"
          }}
        >
          <Slide direction="right" in={true} mountOnEnter unmountOnExit>
            <div style={{
              backgroundImage: `url(${reg_doc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              height: "95vh"
            }}>
            </div>
          </Slide>
          <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Card sx={{ maxWidth: 500, height: '80vh', width: '550rem' }}>
              <Stack direction="column" spacing={3} sx={{ justifyContent: "center", alignItems: "center", mt: 5 }}>
                <Typography variant="h5">Doctor Registration</Typography>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "80%", maxWidth: "500px", margin: "auto" }}>
                  <TextField label="Name" name="name" variant="outlined" fullWidth value={formData.name} onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><Person /></InputAdornment>) }} />
                  <TextField label="Email" name="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) }} />
                  <TextField label="Specialization" name="specialization" variant="outlined" fullWidth select value={formData.specialization} onChange={handleChange}>
                    <MenuItem value="Cardiologist">Cardiologist</MenuItem>
                    <MenuItem value="Dermatologist">Dermatologist</MenuItem>
                    <MenuItem value="Neurologist">Neurologist</MenuItem>
                    <MenuItem value="Pediatrician">Pediatrician</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                  <TextField label="Password" name="password" variant="outlined" type={showPassword ? "text" : "password"} fullWidth value={formData.password} onChange={handleChange} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                  <TextField label="Confirm Password" name="confirmPassword" variant="outlined" type={showConfirmPassword ? "text" : "password"} fullWidth value={formData.confirmPassword} onChange={handleChange} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                  <Button variant="contained" endIcon={<CheckCircleIcon />} sx={{ color: '#fafafa', backgroundColor: '#26a69a' }} onClick={handleSubmit}>Register</Button>
                  <Link to="/DoctorLogin">Already have an account? Sign In</Link>
                </div>
              </Stack>
            </Card>
          </Slide>
        </Stack>
      </Stack>
    </ThemeProvider>
    </>
  );
}
