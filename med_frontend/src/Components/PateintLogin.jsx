import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { Link, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import home_im from '../assets/home_im.jpg';
import axios from 'axios';
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

export default function PatientLogin() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [patientId, setPatientId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/patients/patient/login/", {
        patient_id: patientId,
        password: password,
      });
  
      if (response.status === 200) {
        // Storing the patient_id from the backend response directly
        sessionStorage.setItem('patient_id', response.data.patient_id);
  
        navigate("/PatientMainPage"); // Redirect to dashboard
      }
    } catch (error) {
      alert("Error: " + error.message); // Showing the error message
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
      <Stack>
        <Stack
          direction={{ xs: 'column', sm: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: "center", alignItems: "center", mt: '8rem', mx: 'auto', width: "80%" }}
        >
          <img src={home_im} height="550px" width="400px" alt="Home" />
          <Card sx={{ maxWidth: 500, height: '50vh', width: '550rem', borderRadius: '15%' }}>
            <Stack direction="column" spacing={6} sx={{ justifyContent: "center", alignItems: "center", mt: 5 }}>
              <Typography variant="h5">Sign In to Dashboard</Typography>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "80%", maxWidth: "500px", margin: "auto" }}>
                <TextField
                  label="Patient ID"
                  variant="outlined"
                  fullWidth
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<CheckCircleIcon />}
                  sx={{ color: '#fafafa', backgroundColor: '#26a69a' }}
                  onClick={handleLogin}
                >
                  Authenticate Me
                </Button>
                <Link to="/PatientSignup">First Time Visiting? Register Here</Link>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </ThemeProvider>
    </>
  );
}
