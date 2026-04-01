import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Building, DollarSign, Clock, Users, ExternalLink, CheckCircle } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);

        // If logged in as Recruiter and it's their job, fetch applications
        if (user && user.role === 'recruiter' && data.recruiterId?._id === user._id) {
          const appRes = await api.get(`/applications/job/${id}`);
          setApplications(appRes.data);
        }

        // If Candidate check if applied
        if (user && user.role === 'candidate') {
          const mAppRes = await api.get('/applications/me');
          const appliedIds = mAppRes.data.map(a => a.jobId._id);
          if (appliedIds.includes(data._id)) {
            setHasApplied(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch job", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setActionLoading(true);
    setMessage(null);
    try {
      await api.post(`/applications/${id}`);
      setMessage({ type: 'success', text: 'Successfully applied to this position!' });
      setHasApplied(true);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to apply' 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications(prev => 
        prev.map(app => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
        <Link to="/" className="text-primary-600 mt-4 inline-block hover:underline">Return Home</Link>
      </div>
    );
  }

  const isEmployer = user && user.role === 'recruiter' && job.recruiterId?._id === user._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 text-sm font-medium">
              <span className="flex items-center gap-1 text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                <Building className="h-4 w-4" />
                {job.recruiterId?.profile?.companyName || 'Startup'}
              </span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                {job.status === 'active' ? 'Active Role' : 'Closed'}
              </span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mt-2 mb-2">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-800">{job.stipend}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {user && user.role === 'candidate' && (
              <div className="mt-8">
                {hasApplied ? (
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 border border-green-200 px-6 py-3 rounded-xl font-bold">
                    <CheckCircle className="h-5 w-5" />
                    You've already applied for this position
                  </div>
                ) : (
                  <button 
                    onClick={handleApply} 
                    disabled={actionLoading}
                    className="btn-primary py-3 px-8 text-lg font-bold shadow-md hover:shadow-lg transform active:scale-95 transition-all"
                  >
                    {actionLoading ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
                {message && (
                  <div className={`mt-4 text-sm font-medium ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {message.text}
                  </div>
                )}
              </div>
            )}
            {!user && (
              <Link to="/login" className="btn-primary p-3 px-8 mt-4 inline-block">
                Sign in to Apply
              </Link>
            )}
          </div>

          <div className="w-full lg:w-1/3 bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary-500" />
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired && job.skillsRequired.map((skill, idx) => (
                <span key={idx} className="bg-white border text-gray-700 py-1.5 px-3 rounded-lg text-sm font-medium shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
            {job.recruiterId?.profile?.website && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a 
                  href={job.recruiterId.profile.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Company Website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Role</h2>
        <div className="prose prose-blue max-w-none prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
          {job.description}
        </div>
      </div>

      {isEmployer && (
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-primary-100 overflow-hidden transform transition-all">
          <div className="bg-gradient-to-r from-dark-900 to-primary-900 p-6 sm:p-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="h-6 w-6" />
              Applicant Tracking
            </h2>
            <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md">
              {applications.length} Candidates
            </span>
          </div>
          
          <div className="p-0">
            {applications.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <li key={app._id} className="p-6 sm:p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-900">{app.candidateId.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                            ${app.status === 'applied' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                              app.status === 'shortlisted' ? 'bg-green-50 text-green-700 border-green-200' : 
                              'bg-red-50 text-red-700 border-red-200'}`
                          }>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-gray-500 font-medium">{app.candidateId.email}</p>
                        
                        {app.candidateId.profile?.skills && app.candidateId.profile?.skills.length > 0 && (
                           <div className="flex flex-wrap gap-2 pt-2">
                             {app.candidateId.profile.skills.map((skill, i) => (
                               <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{skill}</span>
                             ))}
                           </div>
                        )}
                        
                        {app.candidateId.profile?.resumeLink && (
                          <div className="pt-2 flex items-center">
                            <a 
                              href={app.candidateId.profile.resumeLink} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center font-medium text-sm text-primary-600 hover:text-primary-800 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4 mr-1.5" />
                              View Resume
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex md:flex-col gap-3 shrink-0 my-auto">
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                          disabled={app.status === 'shortlisted'}
                          className="px-6 py-2 bg-dark-900 text-white hover:bg-dark-800 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors w-full"
                        >
                          Shortlist
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'rejected')}
                          disabled={app.status === 'rejected'}
                          className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors w-full"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16 px-6">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No applicants yet.</h3>
                <p className="text-gray-500 mt-1">When candidates apply, their profiles will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
