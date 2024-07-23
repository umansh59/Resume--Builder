require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const port = 5000;

const app = express();
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

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
  Hyperlinks: [{ link: String }],
  summary: String,
  workExperiences: [{
    company: String,
    position: String,
    fromYear: String,
    toYear: String,
    description: String,
  }],
  educations: [{
    degree: String,
    school: String,
    fromYear: String,
    toYear: String,
  }],
  skills: [String],
  certifications: [{
    course: String,
    institute: String,
  }],
  projects: [{
    name: String,
    date: String,
    location: String,
    description: String,
    hyperlink: String,
  }],
});

const FormSubmission = mongoose.model('formSubmission', formSubmissionSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userType: String,
});

const User = mongoose.model('User', userSchema);

// User authentication routes
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, userType });
    await newUser.save();
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

    const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

app.post('/form-submissions', authMiddleware, async (req, res) => {
  try {
    const newFormSubmission = new FormSubmission({ userId: req.userId, ...req.body });
    const savedSubmission = await newFormSubmission.save();
    res.json(savedSubmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/form-submissions', authMiddleware, async (req, res) => {
  try {
    const { userType } = req;

    if (userType === 'admin') {
      const allSubmissions = await FormSubmission.find({});
      res.status(200).json(allSubmissions);
    } else {
      const userSubmissions = await FormSubmission.find({ userId: req.userId });
      res.status(200).json(userSubmissions);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/form-submissions/:id', authMiddleware, async (req, res) => {
  try {
    const { userType } = req;

    if (userType === 'admin') {
      const submission = await FormSubmission.findById(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: 'Form submission not found' });
      }
      res.status(200).json(submission);
    } else {
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

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
