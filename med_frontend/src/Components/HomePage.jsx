import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Stack, Button, Typography, AppBar, Toolbar, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import medical from "../assets/Medical_logo.png";
import home_im from '../assets/home_im.jpg';
import Slide from '@mui/material/Slide';
const theme = createTheme({
  palette: {
    primary: {
      main: '#26a69a', // Teal color
    },
    secondary: {
      main: '#ff4081', // Pink color
    },
  },
  components: {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
});

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#2c3e50', boxShadow: 2 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={medical} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
            <Typography variant="h6" color="white">
              Doctor Connect
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg">
        
        <Stack direction="column" spacing={4} sx={{ justifyContent: "center", alignItems: "center", mt: 6, textAlign: 'center' }}>
         
          <Typography variant="h3" fontWeight="bold" color="primary">
            Welcome to Doctor Connect Platform
          </Typography>
          <Typography variant="h6" color="textSecondary">
            The ultimate consultation booking platform for doctors and patients.
          </Typography>
          

          <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ alignItems: "center" }}>
            {/* Buttons Section */}
            
            <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/PateintLogin')}
                sx={{ width: '200px', fontSize: '18px', padding: '10px' }}
              >
                For Patients
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/DoctorLogin')}
                sx={{ width: '200px', fontSize: '18px', padding: '10px' }}
              >
                For Doctors
              </Button>
            </Stack>
            

            {/* Image */}
           
            <img src={home_im} alt="Medical Illustration" style={{ height: "400px", borderRadius: '10px', boxShadow: '5px 5px 15px rgba(0,0,0,0.2)' }} />
            
          </Stack>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}
