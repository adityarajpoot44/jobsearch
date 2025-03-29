import Job from "../models/job.js";
import fs from "fs";
import path from "path";

const insertJobData = async () => {
  try {
    const filePath = path.join(process.cwd(), "controller", "data.json");

    if (!fs.existsSync(filePath)) {
      console.error("Error: data.json file not found!");
      return;
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    console.log("Raw JSON data loaded.");

    let jobDataArray;
    try {
      jobDataArray = JSON.parse(rawData);
    } catch (parseError) {
      console.error("Error parsing JSON file:", parseError);
      return;
    }

    if (!Array.isArray(jobDataArray)) {
      console.error("Invalid JSON format: Expected an array.");
      return;
    }

    console.log(`Processing ${jobDataArray.length} job entries...`);

    const jobEntries = jobDataArray.map((data) => ({
      jobID: String(data?.jobID?.$numberLong || data?.jobID || `job_${Date.now()}`),
      title: data?.title?.trim() || "Not Provided",
      company: data?.company?.trim() || "Not Disclosed",
      location: data?.location?.trim() || "Remote",
      job_link: data?.job_link || "https://example.com",
      employment_type: data?.employment_type || "Full-time",
      experience: data?.experience || "0-1 Years",
      source: data?.source || "Unknown",
      country: data?.country || "Unknown",
      postedDateTime: data?.postedDateTime?.$date ? new Date(data.postedDateTime.$date) : new Date(),
      companyImageUrl: typeof data?.companyImageUrl === "object" ? "https://default-image.com/logo.png" : data.companyImageUrl || "https://default-image.com/logo.png",
      min_exp: Number(data?.min_exp) || 0,
      max_exp: Number(data?.max_exp) || 0,
    }));

    // Remove duplicates
    const existingJobs = new Set(await Job.distinct("jobID"));
    const uniqueJobs = jobEntries.filter(job => !existingJobs.has(job.jobID));
    console.log(`Unique jobs after filtering: ${uniqueJobs.length}`);

    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < uniqueJobs.length; i += batchSize) {
      const batch = uniqueJobs.slice(i, i + batchSize);
      await Job.insertMany(batch, { ordered: false }); // Insert batch
      console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(uniqueJobs.length / batchSize)}`);
    }

    console.log("All jobs inserted successfully!");

  } catch (error) {
    console.error("Error processing job data:", error);
  }
};

export default insertJobData;