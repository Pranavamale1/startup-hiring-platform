import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building, Users, ArrowRight } from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-white min-h-[calc(100vh-4rem)] flex flex-col pt-20">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-sm border border-primary-100 mb-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
          The #1 Hiring Platform for Startups
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-dark-900 leading-tight">
          Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Startup</span> role.
        </h1>
        
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Connect directly with innovative startups. Whether you're a builder looking for a mission, or a startup looking for builders.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 group text-lg px-8 py-4 w-full sm:w-auto">
            Get Started
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
            Sign In
          </Link>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="max-w-7xl mx-auto w-full px-4 mt-32">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Opportunities</h2>
            <p className="text-gray-500 mt-2">Explore the newest roles curated for you.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {jobs.length > 0 ? (
              jobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No jobs posted yet</h3>
                <p className="text-gray-500">Check back soon for exciting new opportunities!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
