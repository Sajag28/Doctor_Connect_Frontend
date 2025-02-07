import { useEffect, useState } from "react";
import { 
  Container, Grid, Card, CardContent, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Box, Paper
} from "@mui/material";
import { Link } from "react-router-dom";
import medical from "../assets/Medical_logo.png"
export default function DoctorDashboard() {
 
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workDays, setWorkDays] = useState([]);
  const [maxSlots, setMaxSlots] = useState(3);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [record, setRecord] = useState({
    name:"",
    patient_id: "",
    diagnosis: "",
    treatment: "",
    doctor_id: sessionStorage.getItem("doctor_id"),
    date: ""
  });
  const [curr_record, setCurrRecord] = useState({
    patient_id: "",
    record_id: "",  // Make sure this field is included for updating records
    diagnosis: "",
    treatment: "",
    doctor_id: sessionStorage.getItem("doctor_id"),
    date: ""
  });
  const [recordIdToDelete, setRecordIdToDelete] = useState("");
  const fetchRecords = (doctorId) => {
    fetch("http://localhost:8000/patients/records/list/",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctorId }),
    })
      .then((response) => response.json())
      .then((data) => setRecords(data))
      .catch((error) => console.error("Error fetching records:", error));
  };
  const fetchAppointments = (doctorId) => {
    fetch(`http://localhost:8000/patients/doctor/appointments/${doctorId}/`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
      redirect: "follow", // Allow redirects
  }).then((response) => response.json())
      .then((data) => {
        console.log(data)
        setAppointments(data)})
      .catch((error) => console.error("Error fetching appointments:", error));
  };
  useEffect(() => {
    const doctorId = sessionStorage.getItem("doctor_id");
    if (!doctorId) {
      alert("Doctor ID not found. Please log in.");
      window.location.href = "/DoctorLogin";
      return;
    }

    fetch("http://localhost:8000/patients/doctor/details/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_id: doctorId }),
    })
      .then((response) => response.json())
      .then((data) => setDoctor(data))
      .catch((error) => console.error("Error fetching doctor details:", error))
      .finally(() => setLoading(false));
      fetchRecords(doctorId); 
      fetchAppointments(doctorId);
  }, []);

  const updateAvailability = () => {
    const doctorId = sessionStorage.getItem("doctor_id");
    fetch("http://localhost:8000/patients/doctor/set_availability/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_id: doctorId, work_days: workDays, max_slots_per_time: maxSlots }),
    })
      .then((response) => response.json())
      .then((data) => alert(data.message || "Availability Updated!"))
      .catch((error) => console.error("Error updating availability:", error));
  };

  const createMedicalRecord = () => {
    console.log(record)
    fetch("http://localhost:8000/patients/records/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    })
      .then((response) => response.json())
      .then((data) => alert(data.message))
      .catch((error) => console.error("Error creating medical record:", error));
  };
  const deleteMedicalRecord = () => {
    fetch(`http://localhost:8000/patients/records/delete/${recordIdToDelete}/`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => alert(data.message))
      .catch((error) => console.error("Error deleting record:", error));
  };
  

  const updateMedicalRecord = () => {
    if (!curr_record.record_id) {
      alert("Please enter a valid Record ID.");
      return;
    }
    console.log(curr_record)
    fetch(`http://localhost:8000/patients/records/update/${curr_record.record_id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(curr_record),
    })
      .then((response) => response.json())
      .then((data) => alert(data.message || "Medical record updated successfully!"))
      .catch((error) => console.error("Error updating medical record:", error));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
    <nav className="bg-gray-800 p-4 flex items-center">
      {/* Logo */}
      <Link to="/" className="mr-4">
        <img src={`${medical}`} alt="Logo" className="h-10" heigh="250px" width="250px"/>
      </Link>
      
    </nav>
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}>
          Welcome, Dr. {doctor.name}
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 4, color: "gray" }}>
          Doctor ID: {doctor.doctor_id}
        </Typography>
      </Paper>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3,maxHeight: "300px", overflowY: "auto", p: 2  }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Appointments</Typography>
              {appointments.length === 0 ? (
                <Typography>No appointments found</Typography>
              ) : (
                appointments.map((appointment) => (
                  <Paper key={appointment.appointment_id} sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
                    
                    <Typography variant="subtitle1"><strong>Appointment Number:</strong> {appointment.appointment_id}</Typography>
                    <Typography variant="subtitle1"><strong>Patient ID:</strong> {appointment.patient_id}</Typography>
                    <Typography variant="body2"><strong>Time:</strong> {appointment.scheduled_time}</Typography>
                    <Typography variant="body2"><strong>Status:</strong> {appointment.status}</Typography>
                  </Paper>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {/* List of Patient Records */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3,maxHeight: "300px", overflowY: "auto", p:2  }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>All Medical Records</Typography>
              {records.length === 0 ? (
                <Typography>No records found</Typography>
              ) : (
                records.map((rec) => (
                  <Paper key={rec.record_id} sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="record"><strong>Record ID:</strong> {rec.record_id}</Typography>
                    <Typography variant="subtitle1"><strong>Patient:</strong> {rec.patient_name} (ID: {rec.patient_id})</Typography>
                    <Typography variant="body2"><strong>Diagnosis:</strong> {rec.diagnosis}</Typography>
                    <Typography variant="body2"><strong>Treatment:</strong> {rec.treatment}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {rec.date}</Typography>
                  </Paper>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 3 }}>
      <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Create Medical Record</Typography>
              <TextField label="Patient Name" fullWidth sx={{ mb: 2 }} value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} />
              <TextField label="Patient ID" fullWidth sx={{ mb: 2 }} value={record.patient_id} onChange={(e) => setRecord({ ...record, patient_id: e.target.value })} />
              <TextField label="Diagnosis" fullWidth sx={{ mb: 2 }} value={record.diagnosis} onChange={(e) => setRecord({ ...record, diagnosis: e.target.value })} />
              <TextField label="Treatment" fullWidth sx={{ mb: 2 }} value={record.treatment} onChange={(e) => setRecord({ ...record, treatment: e.target.value })} />
              <TextField label="Date"  fullWidth sx={{ mb: 2 }} value={record.date} onChange={(e) => setRecord({ ...record, date: e.target.value })} />
              <Button variant="contained" color="primary" fullWidth onClick={createMedicalRecord}>Create New Record</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
  <Card sx={{ boxShadow: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>Update Medical Record</Typography>
      
      {/* Record ID Field */}
      <TextField
        label="Record ID"
        fullWidth
        sx={{ mb: 2 }}
        value={curr_record.record_id}
        onChange={(e) => setCurrRecord({ ...curr_record, record_id: e.target.value })}
      />
      
      {/* Patient ID Field */}
      <TextField
        label="Patient ID"
        fullWidth
        sx={{ mb: 2 }}
        value={curr_record.patient_id}
        onChange={(e) => setCurrRecord({ ...curr_record, patient_id: e.target.value })}
      />
      
      {/* Diagnosis Field */}
      <TextField
        label="Diagnosis"
        fullWidth
        sx={{ mb: 2 }}
        value={curr_record.diagnosis}
        onChange={(e) => setCurrRecord({ ...curr_record, diagnosis: e.target.value })}
      />
      
      {/* Treatment Field */}
      <TextField
        label="Treatment"
        fullWidth
        sx={{ mb: 2 }}
        value={curr_record.treatment}
        onChange={(e) => setCurrRecord({ ...curr_record, treatment: e.target.value })}
      />
      
      {/* Doctor ID Field */}
      
      
      {/* Date Field */}
      <TextField
        label="Date"
        fullWidth
        sx={{ mb: 2 }}
        value={curr_record.date}
        onChange={(e) => setCurrRecord({ ...curr_record, date: e.target.value })}
      />
      
      {/* Update Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={updateMedicalRecord}
      >
        Update Record
      </Button>
    </CardContent>
  </Card>
</Grid>
        <Grid item xs={12} md={6} sx={{mx:'auto'}}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Delete Medical Record</Typography>
              <TextField label="Enter Record ID" fullWidth sx={{ mb: 2 }} value={recordIdToDelete} onChange={(e) => setRecordIdToDelete(e.target.value)} />
              <Button variant="contained" color="error" fullWidth onClick={deleteMedicalRecord}>Delete Record</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Set Availability</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Work Days</InputLabel>
                <Select 
                  multiple
                  value={workDays}
                  onChange={(e) => setWorkDays(e.target.value)}
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField 
                type="number"
                label="Max Slots Per Time"
                variant="outlined"
                fullWidth
                value={maxSlots}
                onChange={(e) => setMaxSlots(Number(e.target.value))}
                sx={{ mb: 2 }}
              />

              <Button variant="contained" color="success" fullWidth onClick={updateAvailability}>
                Save Availability
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}
