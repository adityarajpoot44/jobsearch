import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/connection.js';
import insertJobData from './controller/dataparse.js';
import { detailsjobview, getDataUserInput } from './controller/search.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(cors({
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type',
  }));
app.use(bodyParser.json());  
app.use(express.static("public"));




connectDB();

app.post("/add-job", async (req, res) => {
  try {
    console.log("Adding jobs from file...");

    await insertJobData();  

    res.status(201).json({ message: "Jobs added successfully from file!" });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ error: "Failed to add jobs" });
  }
});

app.get('/jobs/search',getDataUserInput)
app.get('/job/details',detailsjobview)

app.get('/locations', async (req, res) => {
  try {
    const locations = await mongoose.connection.db.collection('jobs').distinct('location');
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
