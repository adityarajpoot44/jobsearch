import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [jobListings, setJobListings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    if (!selectedLocation.trim()) return; 
    fetch(`http://localhost:3000/jobs/search?location=${selectedLocation}`)
      .then((response) => response.json())
      .then((data) => {
        setJobListings(data);
        setSelectedJob(null);
      })
      .catch((error) => console.error("Error fetching job listings:", error));
  }, [selectedLocation]);

  return (
    <div className="flex h-screen p-6 bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-1/3 bg-white p-5 rounded-lg shadow-xl flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-800 text-center">Job Listings</h2>

        
        <input
          type="text"
          className="w-full p-3 mb-4 border rounded-lg bg-indigo-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          placeholder="Type a location..."
        />

        <div className="flex-1 overflow-y-auto">
          {jobListings.length > 0 ? (
            jobListings.map((job, index) => (
              <div
                key={job._id || index}
                className={`p-4 mb-3 border rounded-lg cursor-pointer transition-all duration-300 shadow-sm ${
                  selectedJob?._id === job._id ? "bg-indigo-200" : "hover:bg-indigo-100"
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <h3 className="text-lg font-bold text-indigo-900">{job.title}</h3>
                <p className="text-pink-600 font-medium">{job.company} - <span className="text-gray-800">{job.location}</span></p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No jobs available</p>
          )}
        </div>
      </div>

      {selectedJob && (
        <div className="w-2/3 ml-6 bg-white p-8 rounded-lg shadow-xl overflow-auto border border-gray-200">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-indigo-900 text-center mb-12">{selectedJob.title}</h2>
            <div className="grid grid-cols-2 gap-4 mb-25">
              <p className="text-gray-600 text-md"><strong>Company:</strong> <span className="text-pink-600">{selectedJob.company || "Not specified"}</span></p>
              <p className="text-gray-600 text-md"><strong>Location:</strong> {selectedJob.location || "Not specified"}</p>
              <p className="text-gray-600 text-md"><strong>Employment Type:</strong> {selectedJob.employment_type || "Not specified"}</p>
              <p className="text-gray-600 text-md">
                <strong>Posted:</strong> {selectedJob.postedDateTime ? selectedJob.postedDateTime.split("T")[0] : "N/A"}
              </p>
              <p className="text-gray-600 text-md mb-6"><strong>Source:</strong> {selectedJob.source || "Unknown"}</p>
              <p className="text-gray-600 text-md"><strong>Experience Range:</strong> {selectedJob.experience || "Not specified"}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Description:</h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedJob.description ||
                  "This role requires strong problem-solving skills, effective communication, and the ability to work both independently and collaboratively. Responsibilities include analyzing requirements, executing tasks efficiently, and ensuring high-quality deliverables. Candidates should have a proactive approach to learning and adapting to new challenges. Attention to detail, time management, and a results-driven mindset are key attributes for success in this position."}
              </p>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-indigo-500 text-white py-3 px-8 rounded-lg hover:bg-indigo-600 transition-all duration-300 shadow-md">
                Quick Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
