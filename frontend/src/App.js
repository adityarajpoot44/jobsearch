import { useState, useEffect } from "react";

export default function JobSearch() {
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/locations`)
      .then((res) => res.json())
      .then((data) => setLocations([...new Set(data)]));
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/jobs/search?location=${location}`)
      .then((res) => res.json())
      .then((data) => {
        const uniqueJobs = Array.from(new Map(data.map(job => [job._id, job])).values());
        setJobs(uniqueJobs);
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Left Side - Job Listings */}
      <div className="w-1/2 bg-white p-6 shadow-lg rounded-lg text-black">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Find Your Dream Job</h2>
        <input
          type="text"
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type or select location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          list="location-options"
        />
        <datalist id="location-options">
          {locations.map((loc, index) => (
            <option key={index} value={loc} />
          ))}
        </datalist>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold mt-2 transition duration-300"
          onClick={handleSearch}
        >
          {loading ? "Searching..." : "Search Jobs"}
        </button>

        {/* Job Listings */}
        <div className="mt-6 space-y-4 max-h-80 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-600">Searching...</p>
          ) : (
            jobs.length > 0 ? (
              <ul>
                {jobs.map((job) => (
                  <li
                    key={job._id}
                    className="p-4 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition duration-300"
                    onClick={() => setSelectedJob(job)}
                  >
                    <h3 className="font-semibold text-gray-800">{job.title}</h3>
                    <p className="text-gray-600">{job.company} - {job.location}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No jobs found</p>
            )
          )}
        </div>
      </div>

      {/* Right Side - Job Details */}
      <div className="w-1/2 bg-white p-6 shadow-lg rounded-lg ml-6 text-black">
        {selectedJob ? (
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-3 text-gray-800 border-b pb-2">{selectedJob.title}</h2>
            <p className="text-lg font-semibold text-gray-700">{selectedJob.company}</p>
            <p className="text-gray-600 mb-2">📍 {selectedJob.location}</p>
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700"><strong>Experience:</strong> {selectedJob.experience}</p>
              <p className="text-gray-700"><strong>Source:</strong> {selectedJob.source}</p>
              <p className="text-gray-700"><strong>Date of Posting:</strong>{" "}{new Date(selectedJob.postedDateTime).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                })}
              </p>
              <p className="text-gray-700"><strong>Employment Type:</strong> {selectedJob.employment_type}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg shadow-inner">
                {selectedJob.description || "This position requires a proactive and innovative mindset, a keen eye for detail, and the ability to collaborate effectively in a team environment. Candidates should be adaptable to dynamic work scenarios and eager to learn and grow. Problem-solving skills and a commitment to quality are essential for success in this role."}
              </p>
            </div>
            <a
              href={selectedJob.job_link}
              className="mt-6 block text-center bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition duration-300 w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
            </a>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-gray-500 text-lg">Select a job to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
