
import Job from "../models/job.js"; 

export const getDataUserInput = async (req, res) => {
  try {
    const { title, location } = req.query;

   
    let query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" }; 
    }
    if (location) {
      query.location = { $regex: location, $options: "i" }; 
    }

   
    const jobs = await Job.find(query);

    if (jobs.length === 0) {
      return res.status(404).json({ message: "No matching jobs found" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const detailsjobview = async (req, res) => {
    try {
        const { jobID } = req.params; 
    
        
        const job = await Job.findOne({ jobID });
    
        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }
    
        res.status(200).json(job); 
      } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({ message: "Server error" });
      }
  };


