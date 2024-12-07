// models/Clinical.js

import mongoose from 'mongoose';
//const mongoose = require('mongoose');

const clinicalSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    type: { type: String, required: true },
    value: { type: String, required: true },
    dateTime: { type: Date, required: true },
  });

  const Clinical = mongoose.model('Clinical', clinicalSchema);

  export default Clinical;
