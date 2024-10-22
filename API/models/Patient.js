// models/Patient.js

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  condition: { type: String, default: 'Stable' },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  emergencyContactPhone: { type: String },
});

module.exports = mongoose.model('Patient', patientSchema);
