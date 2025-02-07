import React, { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Card, CardContent, Grid, Paper, Box } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import medical from "../assets/Medical_logo.png"
const PatientDashboard = () => {
    const [patientData, setPatientData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [appointmentData, setAppointmentData] = useState({ doctor_id:"",patient_id: sessionStorage.getItem("patient_id"), scheduled_time: "", day: "" });
    const [rescheduleData, setRescheduleData] = useState({ appointment_id: "", new_time: "" });
    const [cancelId, setCancelId] = useState("");
    const [records, setRecords] = useState([]);
    useEffect(() => {
        const fetchPatientData = async () => {
            const patient_id = sessionStorage.getItem("patient_id");
            if (!patient_id) {
                console.log("No Patient ID found");
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/patients/patient/dashboard/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ patient_id })
                });
                const data = await response.json();
                setPatientData(data.patient_details);
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };

        const fetchAppointments = async () => {
            const patient_id = sessionStorage.getItem("patient_id");
            if (!patient_id) {
                console.log("No Patient ID found");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/patients/patient/appointments/${patient_id}/`);
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };
        const fetchRecords = async () => {
            const patient_id = sessionStorage.getItem("patient_id");
            try {
                const response = await axios.get(`http://localhost:8000/patients/records/view/${patient_id}/`);
                setRecords(response.data);
            } catch (error) {
                console.error("Error fetching medical records:", error);
            }
        };

        fetchPatientData();
        fetchAppointments();
        fetchRecords();
    }, []);

    const handleBookAppointment = async () => {
        try {
            const response = await axios.post("http://localhost:8000/patients/appointment/book/", appointmentData, {
                headers: { "Content-Type": "application/json" }
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert(error.response?.data?.message);
        }
    };

    const handleRescheduleAppointment = async () => {
        const patient_id = sessionStorage.getItem("patient_id");
        try {
            const response = await axios.post(
                `http://localhost:8000/patients/appointment/reschedule/${rescheduleData.appointment_id}/`,
                { ...rescheduleData, patient_id },
                { headers: { "Content-Type": "application/json" } }
            );
            alert(response.data.message);
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
            alert(error.response?.data?.message || "Rescheduling failed");
        }
    };

    const handleCancelAppointment = async () => {
        const patient_id = sessionStorage.getItem("patient_id");
        try {
            const response = await fetch(`http://localhost:8000/patients/appointment/cancel/${cancelId}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patient_id })
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Error canceling appointment:", error);
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
        <Container>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                PATIENT DASHBOARD
            </Typography>
            {patientData && (
                <Card sx={{ mb: 3, p: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
                            PATIENT INFO
                        </Typography>
                        <Typography><b>Patient ID:</b> {sessionStorage.getItem("patient_id")}</Typography>
                        <Typography><b>Name:</b> {patientData.name}</Typography>
                        <Typography><b>Age:</b> {patientData.age}</Typography>
                        <Typography><b>Gender:</b> {patientData.gender}</Typography>
                        <Typography><b>Contact:</b> {patientData.contact}</Typography>
                        <Typography><b>Medical History:</b> {patientData.medical_history.join(", ")}</Typography>
                    </CardContent>
                </Card>
            )}
            
            <Typography variant="h5" align="center" fontWeight="bold" sx={{ mt: 4 }}>
                APPOINTMENTS
            </Typography>
            <Box sx={{ maxHeight: "300px", overflowY: "auto", p: 2, boxShadow: 3 }}>
            {appointments.length > 0 ? (
                appointments.map((appointment) => (
                    <Card key={appointment.appointment_id} sx={{ mt: 2, p: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography><b>Appointment ID:</b> {appointment.appointment_id}</Typography>
                            <Typography><b>Doctor ID:</b> {appointment.doctor_id}</Typography>
                            <Typography><b>Time:</b> {appointment.scheduled_time}</Typography>
                            <Typography><b>Status:</b> {appointment.status}</Typography>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography align="center">No Appointments Found</Typography>
            )}
            </Box>
            <Grid container spacing={3} mt={3}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: "100%", boxShadow: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Book Appointment</Typography>
                            <TextField label="Doctor ID" fullWidth sx={{ mb: 2 }} onChange={(e) => setAppointmentData({ ...appointmentData, doctor_id: e.target.value })} />
                            <TextField label="Scheduled Time (HH:MM)" fullWidth sx={{ mb: 2 }} onChange={(e) => setAppointmentData({ ...appointmentData, scheduled_time: e.target.value })} />
                            <TextField label="Day" fullWidth sx={{ mb: 2 }} onChange={(e) => setAppointmentData({ ...appointmentData, day: e.target.value })} />
                            <Button variant="contained" color="primary" fullWidth onClick={handleBookAppointment}>Book</Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: "100%", boxShadow: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Cancel Appointment</Typography>
                            <TextField label="Appointment ID" fullWidth sx={{ mb: 2 }} onChange={(e) => setCancelId(e.target.value)} />
                            <Button variant="contained" color="error" fullWidth onClick={handleCancelAppointment}>Cancel</Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: "100%", boxShadow: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Reschedule Appointment</Typography>
                            <TextField label="Appointment ID" fullWidth sx={{ mb: 2 }} onChange={(e) => setRescheduleData({ ...rescheduleData, appointment_id: e.target.value })} />
                            <TextField label="New Time (HH:MM)" fullWidth sx={{ mb: 2 }} onChange={(e) => setRescheduleData({ ...rescheduleData, new_time: e.target.value })} />
                            <Button variant="contained" color="secondary" fullWidth onClick={handleRescheduleAppointment}>Reschedule</Button>
                        </Paper>
                    </Grid>
                </Grid>
            <Typography variant="h5" align="center" fontWeight="bold" sx={{ mt: 10 }}>
    MEDICAL RECORDS
</Typography>
<Box sx={{ maxHeight: "300px", overflowY: "auto", p: 2, boxShadow: 3 }}>
    {records.length > 0 ? (
        records.map((record, index) => (
            <Card key={record.record_id || index} sx={{ mt: 2, p: 2, boxShadow: 2 }}>
                <CardContent>
                    <Typography><b>Record ID:</b> {record.record_id}</Typography>
                    <Typography><b>Record Date:</b> {record.date}</Typography>
                    <Typography><b>Diagnosis:</b> {record.diagnosis}</Typography>
                    <Typography><b>Treatment:</b> {record.treatment}</Typography>
                    <Typography><b>Doctor ID:</b> {record.doctor_id}</Typography>
                </CardContent>
            </Card>
        ))
    ) : (
        <Typography align="center">No Medical Records Found</Typography>
    )}
</Box>
        </Container>
        </>
    );
};

export default PatientDashboard;
