// ─── server.js (Day 5 — FINAL VERSION WITH EMAIL & MOBILE) ─────────────────────────
const express  = require('express');
const mongoose = require('mongoose');
const path     = require('path');

const app  = express();
const PORT = 3000;

// ─── MIDDLEWARE ───────────────────────────────────────────────
// 1. Serve static files from the 'public' folder
app.use(express.static('public'));

// 2. Parse URL-encoded form data (needed to read req.body)
app.use(express.urlencoded({ extended: true }));

// ─── MONGODB CONNECTION ───────────────────────────────────────
const MONGO_URI = 'mongodb://ayushjunghare14_db_user:to51VEDTIfp5At7C@ac-a9lsz80-shard-00-00.qah3qy7.mongodb.net:27017,ac-a9lsz80-shard-00-01.qah3qy7.mongodb.net:27017,ac-a9lsz80-shard-00-02.qah3qy7.mongodb.net:27017/?ssl=true&replicaSet=atlas-4j0nu2-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(function() {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch(function(error) {
    console.log('❌ MongoDB connection failed:', error.message);
  });

// ─── SCHEMA & MODEL ──────────────────────────────────────────
const studentSchema = new mongoose.Schema({
    name:    { type: String, required: true },
    surname: { type: String, required: true },
    email:   { type: String, required: true }, // 🆕 Added Email Field
    mobile:  { type: String, required: true }  // 🆕 Added Mobile Field
});

const Student = mongoose.model('Student', studentSchema);

// ─── ROUTES ──────────────────────────────────────────────────
// Route 1: Serve the form page automatically via express.static middleware above

// Route 2: Receive form submission
app.post('/submit', async function(req, res) {
    try {
        // Read the form data from the request body
        const studentName    = req.body.name;
        const studentSurname = req.body.surname;
        const studentEmail   = req.body.email;  // 🆕 Read email
        const studentMobile  = req.body.mobile; // 🆕 Read mobile

        // Log to terminal so we can see the data
        console.log('New student received:');
        console.log('Name:    ' + studentName + ' ' + studentSurname);
        console.log('Email:   ' + studentEmail);
        console.log('Mobile:  ' + studentMobile);

        // Create a new Student document including new fields
        const newStudent = new Student({
            name:    studentName,
            surname: studentSurname,
            email:   studentEmail,  // 🆕 Save email
            mobile:  studentMobile  // 🆕 Save mobile
        });

        // Save to MongoDB
        await newStudent.save();
        console.log('✅ Student saved to MongoDB!');

        // Send a success response to the browser
        res.send(`
            <html>
            <head>
                <title>Success</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                    .card { border: 1px solid #ccc; padding: 20px; border-radius: 8px; max-width: 400px; }
                    h1 { color: #2e7d32; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>✅ Registration Successful!</h1>
                    <p><strong>Name:</strong> ${studentName} ${studentSurname}</p>
                    <p><strong>Email:</strong> ${studentEmail}</p>
                    <p><strong>Mobile:</strong> ${studentMobile}</p>
                    <hr>
                    <p>Your details have been saved to your MongoDB Atlas cluster database.</p>
                    <a href='/form.html'>Go Back to Form</a>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.log('❌ Error:', error.message);
        res.send('Something went wrong: ' + error.message);
    }
});

// ─── START SERVER ────────────────────────────────────────────
app.listen(PORT, function() {
    console.log('Server is running at http://localhost:' + PORT);
    console.log('Open http://localhost:' + PORT + '/form.html in your browser');
});