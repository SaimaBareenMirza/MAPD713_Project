// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Patient = require('./models/Patient');
const User = require('./models/user');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connect to patient_db
const patientDB = mongoose.createConnection('mongodb://localhost:27017/patient_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

// Connect to user_db
const userDB = mongoose.createConnection('mongodb://localhost:27017/user_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
