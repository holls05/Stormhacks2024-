// server.js
const express = require('express');
const mongoose = require('mongoose');
const mongoose = require('mongoose');

// Define schema for Animal sightings
const animalSchema = new mongoose.Schema({
    // Replace 'name' field with specific animal types
    animalType: {
        type: String,
        enum: ['raccoon', 'coyote', 'bear'] // Example animal types
    },
    photoPath: String,
    location: {
        type: { type: String },
        coordinates: []
    }
});
animalSchema.index({ location: '2dsphere' }); // Index for geospatial queries

const Animal = mongoose.model('Animal', animalSchema);

const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 80; // process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/animal-spotter', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define schema for Animal sightings
const animalSchema = new mongoose.Schema({
    name: String,
    photoPath: String,
    location: {
        type: { type: String },
        coordinates: []
    }
});
animalSchema.index({ location: '2dsphere' }); // Index for geospatial queries
const Animal = mongoose.model('Animal', animalSchema);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/upload', upload.single('animalPhoto'), async (req, res) => {
    try {
        const { animalName, latitude, longitude } = req.body;
        const animal = new Animal({
            name: animalName,
            photoPath: req.file.path,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
        });
        await animal.save();
        res.status(201).send('Animal sighting uploaded successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading animal sighting.');
    }
});

// Get animal sightings
app.get('/animals', async (req, res) => {
    try {
        const animals = await Animal.find();
        res.json(animals);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving animal sightings.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
