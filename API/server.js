// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Patient = require('./models/Patient');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const Clinical = require('./models/Clinical');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connect to patient_db
const patientDB = mongoose.createConnection('mongodb://localhost:27017/patient_db', {
  connectTimeoutMS: 20000,
});
const PatientModel = patientDB.model('Patient', Patient.schema);

// Get all patients
app.get('/patients', async (req, res) => {
  try {
    const patients = await PatientModel.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single patient with clinical data
app.get('/patients/:id', async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // TODO: Fetch all of this patient's clinical data
    
    res.json({ patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new Patient
app.post('/patients', async (req, res) => {
  // Get the values from body
  const {
    patientId,
    name,
    age,
    gender,
    admissionDate,
    condition,
    phone,
    email,
    address,
    emergencyContactPhone,
    medicalHistory,
    allergies,
    bloodType
  } = req.body;

  try {
    // Check the latest patientId in db
    const lastPatient = await PatientModel.findOne().sort({ patientId: -1 });

    // Default patientId is PA001
    let newPatientId = "PA001";
    
    // The new patientID should be the latest patientId+1
    if (lastPatient) {
      const lastIdNumber = parseInt(lastPatient.patientId.slice(2), 10);
      const nextIdNumber = lastIdNumber + 1;

      newPatientId = `PA${String(nextIdNumber).padStart(3, '0')}`;
    }

    // Create a Patient object
    const newPatient = new PatientModel({
      patientId: newPatientId,
      name,
      age,
      gender,
      admissionDate,
      condition,
      phone,
      email,
      address,
      emergencyContactPhone,
      medicalHistory,
      allergies,
      bloodType
    });

    // Store to database
    await newPatient.save();
    res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Connect to user_db
const userDB = mongoose.createConnection('mongodb://localhost:27017/user_db');
const UserModel = userDB.model('User', User.schema);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Search user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Login successfully
    return res.json({ message: "Login successful", user: { email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Connect to user_db
const clinicalDB = mongoose.createConnection('mongodb://localhost:27017/clinical_db');
const ClinicalModel = clinicalDB.model('Clinical', Clinical.schema);

// Add a new clinical measurement
app.post('/clinical', async (req, res) => {
  const newClinical = new ClinicalModel({
    ...req.body,
    dateTime: new Date()  // Use the current date and time
  });

  try {
    await newClinical.save();
    res.status(201).json(newClinical);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get clinical measurements for a specific patient
app.get('/clinical/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    // Search the specific patient's measurement data
    const clinicalData = await ClinicalModel.find({ patient_id: new mongoose.Types.ObjectId(patientId) });

    // Check if data exists
    if (clinicalData.length === 0) {
      return res.status(404).json({ message: "No clinical measurement found." });
    }

    res.status(200).json(clinicalData);
  } catch(error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
