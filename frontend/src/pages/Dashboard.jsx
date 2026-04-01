import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Briefcase, Building, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user.role === 'candidate') {
          // Fetch applied jobs
          const res = await api.get('/applications/me');
          setData(res.data);
        } else if (user.role === 'recruiter') {
          // Fetch posted jobs
          const res = await api.get('/jobs/me');
          setData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const renderCandidateDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <span className="font-medium text-gray-900">{user.name}</span>
          <span>•</span>
          <span>{user.email}</span>
        </div>
        {user.profile.skills && user.profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {user.profile.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary-500" />
            My Applications
          </h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Browse Jobs &rarr;
          </Link>
        </div>

        {data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((app) => (
              <div key={app._id} className="border border-gray-100 rounded-lg p-5 flex items-center justify-between hover:border-primary-100 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{app.jobId.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    <span>Stipend: {app.jobId.stipend}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${app.status === 'applied' ? 'bg-yellow-100 text-yellow-800' : 
                      app.status === 'shortlisted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
                  }>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>You haven't applied to any jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRecruiterDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Building className="h-6 w-6 text-primary-500" />
          {user.profile.companyName || 'Company Profile'}
        </h2>
        <div className="flex items-center gap-4 text-gray-600">
          <span className="font-medium text-gray-900">{user.name}</span>
          <span>•</span>
          <span>{user.email}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary-500" />
            Posted Jobs
          </h2>
          <Link to="/post-job" className="btn-primary text-sm py-2">
            Post New Job
          </Link>
        </div>

        {data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((job) => (
              <div key={job._id} className="border border-gray-100 rounded-lg p-5 hover:border-primary-100 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <Link to={`/jobs/${job._id}`} className="text-lg font-bold text-primary-600 hover:underline">
                    {job.title}
                  </Link>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-1">{job.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">{job.status}</span>
                    <span>{job.stipend}</span>
                  </div>
                </div>
                <Link to={`/jobs/${job._id}`} className="btn-secondary text-sm shrink-0 whitespace-nowrap">
                  Manage Applications
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>You haven't posted any jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user.name.split(' ')[0]}!</p>
      </div>
      
      {user.role === 'candidate' ? renderCandidateDashboard() : renderRecruiterDashboard()}
    </div>
  );
};

export default Dashboard;
