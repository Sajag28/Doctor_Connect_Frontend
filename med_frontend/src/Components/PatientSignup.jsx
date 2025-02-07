import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Stack, Card, Typography, TextField, InputAdornment, IconButton, Button, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Phone, Assignment } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import pat_ph from "../assets/patientregister.jpg";
import Slide from '@mui/material/Slide';
import {useNavigate} from 'react-router-dom'
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

export default function PatientSignup() {
  const navigate=useNavigate()
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    contact: '',
    medical_history: [''],  // Ensure it's initialized as an array
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name === "age") {
      setFormData({ ...formData, [name]: value ? parseInt(value, 10) : '' });
    } else if (name === 'medical_history' && index !== null) {
      const updatedHistory = [...formData.medical_history];
      updatedHistory[index] = value;
      setFormData({ ...formData, medical_history: updatedHistory });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addMedicalHistory = () => {
    setFormData({ ...formData, medical_history: [...formData.medical_history, ''] });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formattedData = {
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      email: formData.email,
      contact: formData.contact,
      medical_history: formData.medical_history.filter(history => history !== ""),  // Remove empty entries
      password: formData.password,
    };

    try {
      console.log(formattedData);  // Log the formatted data for inspection
      const response = await fetch('http://localhost:8000/patients/patient/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('patient_id', data.patient_id);
      
        
        navigate('/PatientDashboard')
      } else {
        console.log(data.message);
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
    <nav className="bg-gray-800 p-2 flex items-center">
          {/* Logo */}
          <Link to="/" className="mr-4">
            <img src={`${medical}`} alt="Logo" className="h-10" heigh="250px" width="250px"/>
          </Link>
          
        </nav>
    <ThemeProvider theme={theme}>
      <Stack direction={{ xs: 'column', sm: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <img src={pat_ph} height="500px" width="500px" alt="Patient Registration" />
        </Slide>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <Stack alignItems="center" justifyContent="center" mt={8}>
            <Card sx={{ padding: 4, maxWidth: 500, width: "400rem" }}>
              <Typography variant="h5" align="center">Register as a Patient</Typography>
              <Stack spacing={2} mt={2}>
                <TextField label="Full Name" name="name" fullWidth variant="outlined" value={formData.name} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} />
                <TextField label="Age" name="age" type="number" fullWidth variant="outlined" value={formData.age} onChange={handleChange} />
                <TextField label="Gender" name="gender" select fullWidth variant="outlined" value={formData.gender} onChange={handleChange}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField label="Email" name="email" fullWidth variant="outlined" value={formData.email} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} />
                <TextField label="Contact" name="contact" fullWidth variant="outlined" value={formData.contact} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }} />
                
                {formData.medical_history.map((history, index) => (
                  <TextField key={index} label={`Medical History ${index + 1}`} name="medical_history" fullWidth variant="outlined" value={history} onChange={(e) => handleChange(e, index)} InputProps={{ startAdornment: <InputAdornment position="start"><Assignment /></InputAdornment> }} />
                ))}
                
                <Button onClick={addMedicalHistory} variant="outlined">+ Add More</Button>
                
                <TextField label="Password" name="password" type={showPassword ? "text" : "password"} fullWidth variant="outlined" value={formData.password} onChange={handleChange} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                
                <TextField label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} fullWidth variant="outlined" value={formData.confirmPassword} onChange={handleChange} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                
                <Button variant="contained" endIcon={<CheckCircleIcon />} sx={{ color: '#fafafa', backgroundColor: '#26a69a' }} onClick={handleSubmit}>Register</Button>
                <Link to="/PateintLogin">Already Registered? Login Here</Link>
              </Stack>
            </Card>
          </Stack>
        </Slide>
      </Stack>
    </ThemeProvider>
    </>
  );
}
