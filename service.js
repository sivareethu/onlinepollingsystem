const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas using your connection string
mongoose.connect('mongodb+srv://myAtlasDBUser:<db_password>@myatlasclusteredu.ujal4.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
});

// Define a schema for votes
const voteSchema = new mongoose.Schema({
    language: String,
    count: Number
});

// Create a model
const Vote = mongoose.model('Vote', voteSchema);

// API Endpoint to get the current poll results
app.get('/api/votes', async (req, res) => {
    try {
        const votes = await Vote.find({});
        res.json(votes);
    } catch (err) {
        res.status(500).send('Error fetching votes');
    }
});

// API Endpoint to submit a vote
app.post('/api/vote', async (req, res) => {
    const { elective } = req.body;
    try {
        let vote = await Vote.findOne({ elective });

        if (vote) {
            // If the elective exists, increment the vote count
            vote.count += 1;
            await vote.save();
        } else {
            // If not, create a new record
            vote = new Vote({ elective, count: 1 });
            await vote.save();
        }

        res.json(vote);
    } catch (err) {
        res.status(500).send('Error submitting vote');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
