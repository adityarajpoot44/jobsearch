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
    origin: 'http://localhost:5000', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type',
  }));
app.use(bodyParser.json());  
app.use(express.static("public"));


// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected!!'))
//   .catch(err => console.log(err));

connectDB();

app.post("/add-job", async (req, res) => {
  try {
    console.log(req.body)
    await insertJobData(req.body);
    res.status(201).json({ message: "Job added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add job" });
  }
});

app.get('/jobs/search',getDataUserInput)
app.get('/job/details',detailsjobview)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
