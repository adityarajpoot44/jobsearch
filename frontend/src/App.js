import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [jobListings, setJobListings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    if (searchLocation.trim() === "") return;

    fetch(`http://localhost:3000/jobs/search?location=${searchLocation}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched job listings:", data);
        setJobListings(data);
        setSelectedJob(null);
      })
      .catch((error) => console.error("Error fetching job listings:", error));
  }, [searchLocation]);

  return (
    <div className="flex h-screen p-6 bg-gray-100">
      {/* Left Sidebar - Job Listings */}
      <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Job Listings</h2>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search by location..."
          className="w-full p-3 mb-4 border rounded-lg text-gray-700"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />

        {/* Job List */}
        <div>
          {jobListings.length > 0 ? (
            jobListings.map((job) => (
              <div
                key={job.id}
                className={`p-4 mb-3 border rounded-lg cursor-pointer transition ${
                  selectedJob?.id === job.id ? "bg-blue-200" : "hover:bg-blue-100"
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <h3 className="text-lg font-bold text-blue-900">{job.title}</h3>
                <p className="text-gray-800 font-medium">{job.company} - {job.location}</p>
            
              </div>
            ))
          ) : (
            <p className="text-gray-600">No jobs found for this location.</p>
          )}
        </div>
      </div>

      {/* Right Section - Job Details */}
      {selectedJob && (
        <div className="w-2/3 ml-6 bg-white p-8 rounded-lg shadow-lg flex flex-col justify-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-900">{selectedJob.title}</h2>
            <p className="text-lg font-semibold text-gray-700">{selectedJob.company}</p>

       

            {/* Job Details */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <p className="text-gray-600 text-md">
                <strong>Location:</strong> {selectedJob.location || "Not specified"}
              </p>
              <p className="text-gray-600 text-md">
                <strong>Employment Type:</strong> {selectedJob.employment_type || "Not specified"}
              </p>
              <p className="text-gray-500">
                <strong>Posted:</strong> {selectedJob.postedDateTime || "N/A"}
              </p>
              <p className="text-gray-600 text-md">
                <strong>Source:</strong> {selectedJob.source || "Unknown"}
              </p>
              <p className="text-gray-600 text-md">
                <strong>Experience Range:</strong> {selectedJob.experience || "Not specified"}
              </p>
            </div>

            {/* Quick Apply Button */}
            <div className="mt-6 text-center">
              <button className="bg-pink-500 text-white py-3 px-8 rounded-lg hover:bg-pink-600 transition">
                Quick Apply
              </button>
            </div>

            {/* Job Description */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Job Description:</h3>
              <p className="text-gray-700 mt-2 leading-relaxed">
              We are seeking a dedicated and motivated professional to join our team. 
              The ideal candidate should have strong problem-solving skills, excellent communication, 
              and the ability to work both independently and collaboratively. Responsibilities include 
              executing tasks efficiently, meeting deadlines, and adapting to evolving work requirements.
               A keen eye for detail, willingness to learn, and commitment to excellence are essential. 
               The role requires time management, critical thinking, and the ability to handle multiple projects.
                Prior experience in a relevant field is preferred but not mandatory. If you are passionate about 
                growth and innovation, we encourage you to apply and be part of our team.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;