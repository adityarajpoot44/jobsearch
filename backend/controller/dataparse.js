import Job from "../models/job.js";
import fs from "fs";
import path from "path";
const insertJobData = async (dataArray) => {

    console.log("Received Data:", dataArray);
    try {
        const filePath = path.join(process.cwd(), "controller", "data.json");

        const rawData = fs.readFileSync(filePath, "utf-8");

    console.log("Raw JSON data:", rawData);

    let jobDataArray;

    try {
      jobDataArray = JSON.parse(rawData); 
    } catch (parseError) {
      console.error("Error parsing JSON file:", parseError);
      return;
    }

    console.log("Parsed JSON data:", jobDataArray);
    console.log("Type of jobDataArray:", typeof jobDataArray);

    if (!Array.isArray(jobDataArray)) {
      console.log("Expected an array but got:", jobDataArray);
      return;
    }

    const jobEntries = jobDataArray.map((data) => ({
        jobID: typeof data.jobID === "object" && data.jobID.$numberLong
        ? data.jobID.$numberLong.toString()  
        : data.jobID || `job_${Date.now()}`,
        title: data.title || "Unknown",
        company: data.company || "Unknown",
        location: data.location || "Remote",
        job_link: data.job_link || "https://example.com",
        employment_type: data.employment_type || "Full-time",
        experience: data.experience || "0-1 Years",
        source: data.source || "Unknown",
        country: data.country || "Unknown",
        postedDateTime: data.postedDateTime?.$date
          ? new Date(data.postedDateTime.$date)
          : new Date(),
      

        companyImageUrl: typeof data.companyImageUrl === "object" 
          ? "https://default-image.com/logo.png" 
          : data.companyImageUrl || "https://default-image.com/logo.png",
      
        min_exp: data.min_exp ?? 0,
        max_exp: data.max_exp ?? 0,
    }));

    console.log(`Inserting ${jobEntries.length} job entries...`);


    await Job.insertMany(jobEntries);

    console.log("All jobs inserted successfully!");
  } catch (error) {
    console.error("Error reading or inserting jobs:", error);
  }
    };

export default insertJobData;
