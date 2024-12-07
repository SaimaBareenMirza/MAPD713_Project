// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Patient from './models/Patient.js';
import User from './models/User.js';
import Clinical from './models/Clinical.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize GCP Storage
const storage = new Storage({
  keyFilename: './gcp-key.json',
  projectId: 'dauntless-gate-423902-a1',
});

// Define the bucket
const bucketName = 'mapd712';
const bucket = storage.bucket(bucketName);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size is 5MB
});

// Set up swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient Data REST API',
      version: '1.0.0',
      description: 'A REST API Service for a Patient Clinical Data management application for the health care providers in the hospital',
    },
    servers: [
      {
        //url: 'http://localhost:3000',
        url: 'https://mapd713project-g3aaaygvf2awetcx.canadacentral-01.azurewebsites.net/',
      },
    ],
    components: {
      schemas: {
        Patient: {
          type: 'object',
          properties: {
            patientId: { type: 'string' },
            name: { type: 'string' },
            age: { type: 'integer' },
            gender: { type: 'string' },
            admissionDate: { type: 'string', format: 'date' },
            condition: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
            emergencyContactPhone: { type: 'string' },
            medicalHistory: { type: 'string' },
            allergies: { type: 'string' },
            bloodType: { type: 'string' },
          },
        },
        Clinical: {
          type: 'object',
          properties: {
            patient_id: { type: 'string' },
            type: { type: 'string' },
            value: { type: 'string' },
            dateTime: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(bodyParser.json());
app.use(cors({
  origin:["https://mapd713project-g3aaaygvf2awetcx.canadacentral-01.azurewebsites.net/"]
}))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
dotenv.config();

//const PORT = process.env.PORT || 8080;
const mongourl = process.env.MONGO_URL;
mongoose.connect(mongourl).then(()=>{
    console.log("Connection success");
    app.listen(PORT, '0.0.0.0', () => {
        console .log(`Server is running on port ${PORT}`)
    })
}).catch((error) => console.log(error));
app.use("/api/patients", Patient);

// Connect to patient_db
const patientDB = mongoose.createConnection('mongodb://localhost:27017/patient_db', {
  connectTimeoutMS: 20000,
});
const PatientModel = patientDB.model('Patient', Patient.schema);

app.get('/', (req,res) => {
  res.send("Hello world One")
});

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     responses:
 *       200:
 *         description: List of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 */

// Get all patients
app.get('/patients', async (req, res) => {
  try {
    const patients = await PatientModel.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a single patient with clinical data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: Patient data and clinical measurements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 */

// Get a single patient with clinical data
app.get('/patients/:id', async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    res.json({ patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Image upload route
app.post('/upload', upload.single('photo'), async (req, res) => {
  // Check if the file uploaded
  if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
  }

  try {
    // Set the file name and its directory
    // patient-photos is a directory used to store patient's photo in the bucket of GCP
    const blob = bucket.file(`patient-photos/${Date.now()}-${req.file.originalname}`);

    // Create a write stream and upload the photo to GCP Storage
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });

    // Handle the event if fail to upload the photo
    blobStream.on('error', (err) => {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Failed to upload the photo', error: err.message });
    });

    // Handle the event after finish uploading
    blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        res.status(200).json({ message: 'Photo uploaded successfully', url: publicUrl });
    });

    // Write the buffer of the photo to the stream
    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Add a new patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Patient ID already exists
 */

// Add a new patient
app.post('/patients', async (req, res) => {
  // Get the values from body
  const {
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
    bloodType,
    photoUrl,
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
      bloodType,
      photoUrl,
    });

    // Store to database
    await newPatient.save();
    res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
/**
* @swagger
* /patients/{id}:
*   put:
*     summary: Update an existing patient
*     parameters: 
*       - in: path
*         name: patientId
*         required: true
*         schema:
*           type: string
*         description: The patient ID
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name: 
*                 type: string
*               age: 
*                 type: string
*               gender:
*                 type: string
*               condition:
*                 type: string
*               phone: 
*                 type: string
*               email:
*                 type: string
*               address:
*                 type: string
*               emergencyContactPhone:
*                 type: string
*               medicalHistory:
*                 type: string
*               allergies: 
*                 type: string
*               bloodType:
*                 type: string
*               photoUrl:
*                 type: string
*     responses:
*       200:
*         description: Patient updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties: 
*                 message:
*                   type: string
*                 patient:
*                   type: object
*                   properties:
*                     name: 
*                       type: string
*                     age: 
*                       type: string
*                     gender:
*                       type: string
*                     condition:
*                       type: string
*                     phone: 
*                       type: string
*                     email:
*                       type: string
*                     address:
*                       type: string
*                     emergencyContactPhone:
*                       type: string
*                     medicalHistory:
*                       type: string
*                     allergies: 
*                       type: string
*                     bloodType:
*                       type: string
*                     photoUrl:
*                       type: string
*       404:
*         description: Patient not found
*       500:
*         description: Internal server error
*/
// Update a patient
app.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    age,
    gender,
    condition,
    phone,
    email,
    address,
    emergencyContactPhone,
    medicalHistory,
    allergies,
    bloodType,
    photoUrl
  } = req.body;

  try {
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      {
        name,
        age,
        gender,
        condition,
        phone,
        email,
        address,
        emergencyContactPhone,
        medicalHistory,
        allergies,
        bloodType,
        photoUrl
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({ message: "Patient updated successfully.", patient: updatedPatient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

/**
 * @swagger
 * /patients/{id}:
 *  delete:
 *    summary: Delete an existing patient
 *    parameters:  
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *          type: string
 *          description: Id of patient to be deleted
 *    responses:
 *      200: 
 *        description: Patient deleted successfully
 *      500:
 *        description: Internal server error
 */
// Delete a patient by ID
app.delete('/patients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the patient by ID and delete it
    const deletedPatient = await PatientModel.findByIdAndDelete(id);

    if (!deletedPatient) {
      // If the patient does not exist, return a 404 response
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Delete all clinical data associated with the patient
    await ClinicalModel.deleteMany({ patient_id: id });

    // Return a success response
    res.status(200).json({ message: 'Patient deleted successfully.' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    // Handle any server errors
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Connect to user_db
const userDB = mongoose.createConnection('mongodb://localhost:27017/user_db');
const UserModel = userDB.model('User', User.schema);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
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
    return res.status(200).json({ message: "Login successful", user: { email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              newPassword:
 *                type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Email and new password are required
 *       404:
 *         description: Email does not exist
 *       500:
 *         description: Internal server error
 */
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email does not exist." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Connect to user_db
const clinicalDB = mongoose.createConnection('mongodb://localhost:27017/clinical_db');
const ClinicalModel = clinicalDB.model('Clinical', Clinical.schema);

/**
 * @swagger
 * /clinical:
 *   post:
 *     summary: Add a new clinical measurement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clinical'
 *     responses:
 *       201:
 *         description: Clinical measurement created successfully
 *       400:
 *         description: Error in creating clinical measurement
 */

// Add a new clinical measurement
app.post('/clinical', async (req, res) => {
  const { patient_id, type, value } = req.body;

  const newClinical = new ClinicalModel({
    ...req.body,
  });

  try {
    await newClinical.save();

    // Define abnormal value thresholds
    const abnormalThresholds = {
      'Blood Pressure': (val) => {
        const [systolic, diastolicWithUnit] = val.split('/');
        const diastolic = diastolicWithUnit.split(' ')[0];

        return Number(systolic) > 180 || Number(systolic) < 90 || Number(diastolic) > 120 || Number(diastolic) < 60;
      },
      'Respiratory Rate': (val) => {
        const rate = val.split(' ')[0];
        return Number(rate) < 12 || Number(rate) > 20;
      },
      'HeartBeat Rate': (val) => {
        const rate = val.split(' ')[0];

        return Number(rate) < 60 || Number(rate) > 100;
      },
      'Blood Oxygen Level': (val) => {
        const rate = val.split(' ')[0];

        return Number(rate) < 90;
      },
    };

    // Check if the measurement is abnormal
    const isAbnormal = abnormalThresholds[type] && abnormalThresholds[type](value);

    if (isAbnormal) {
      // Update the patient's condition to "Critical" if the value is abnormal
      const patient = await PatientModel.findByIdAndUpdate(
        patient_id,
        { condition: 'Critical' },
        { new: true }
      );

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
      }
    }

    res.status(201).json(newClinical);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /clinical/{patientId}:
 *   get:
 *     summary: Get clinical measurements for a specific patient
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: List of clinical measurements
 *       404:
 *         description: No clinical measurement found
 */

// Get clinical measurements for a specific patient
app.get('/clinical/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    // Search the specific patient's measurement data
    const clinicalData = await ClinicalModel.find({ patient_id: new mongoose.Types.ObjectId(patientId) });

    res.status(200).json(clinicalData);
  } catch(error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
