const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth'); // Import the auth middleware

const port = 5000;


const app = express();
app.use(cors());
app.use(express.json());



mongoose.connect('mongodb://localhost:27017/formSubmissions');
const db = mongoose.connection;

const formSubmissionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: String,
  phone: String,
  email: String,
  Address: String,
  Hyperlinks: [{ link:String}],
  summary: String,
  educations: [{ degree: String, school: String, fromYear: String, toYear: String }],
  skills: [String],
  certifications: [{ course: String, institute: String }],
  projects: [{
    name: String,
    date: String,
    location: String,
    description: String,
    hyperlink: String,
  }],
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userType:String,
});



const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
// User authentication routes
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password,userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword ,userType});
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Use environment variable for the JWT secret key
// Assuming you are using jwt.sign
const token = jwt.sign({ userId: user._id, userType: user.userType }, 'Hello-there', { expiresIn: '1h' });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/auth/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    res.json({ exists: !!user }); // Returns true if user exists, false otherwise
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ...

app.get('/protected', authMiddleware, (req, res) => {
  // The user is authenticated, do something here
  res.json({ message: 'You have access to this route!' });
});





app.post('/form-submissions', authMiddleware, async (req, res) => {
  try {
    // Associate the form submission with the logged-in user
    const newFormSubmission = new FormSubmission({ userId: req.userId, ...req.body });
    const savedSubmission = await newFormSubmission.save();
    res.json(savedSubmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to retrieve all form submissions of the logged-in user




// Route to retrieve all form submissions
app.get('/form-submissions', authMiddleware, async (req, res) => {
  try {
    const { userType } = req;

    console.log('User Type:', userType); // Log the userType

    if (userType === 'admin') {
      // If the user is an admin, retrieve all form submissions without filtering by user ID
      const allSubmissions = await FormSubmission.find({});
      res.status(200).json(allSubmissions);
    } else {
      // If the user is not an admin, retrieve form submissions only for the logged-in user
      const userSubmissions = await FormSubmission.find({ userId: req.userId });
      res.status(200).json(userSubmissions);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Route to retrieve a specific form submission by ID of the logged-in user
// app.js

app.get('/form-submissions/:id', authMiddleware, async (req, res) => {
  try {
    const { userType } = req;

    if (userType === 'admin') {
      // If the user is an admin, retrieve the form submission by ID without filtering by user ID
      const submission = await FormSubmission.findById(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: 'Form submission not found' });
      }
      res.status(200).json(submission);
    } else {
      // If the user is not an admin, retrieve the form submission by ID for the logged-in user
      const submission = await FormSubmission.findOne({ _id: req.params.id, userId: req.userId });
      if (!submission) {
        return res.status(404).json({ message: 'Form submission not found' });
      }
      res.status(200).json(submission);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update a specific form submission by ID of the logged-in user
app.put('/form-submissions/:id', authMiddleware, async (req, res) => {
  try {
    const updatedSubmission = await FormSubmission.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updatedSubmission) {
      return res.status(404).json({ message: 'Form submission not found' });
    }
    res.status(200).json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a specific form submission by ID of the logged-in user
app.delete('/form-submissions/:id', authMiddleware, async (req, res) => {
  try {
    const deletedSubmission = await FormSubmission.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deletedSubmission) {
      return res.status(404).json({ message: 'Form submission not found' });
    }
    res.status(200).json({ message: 'Form submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting form submission:', error);
    res.status(500).json({ error: error.message });
  }
});



// ...




app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});