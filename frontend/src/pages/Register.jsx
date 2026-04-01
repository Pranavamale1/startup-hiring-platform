import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { User, Mail, Lock, Building, Briefcase, FileText } from 'lucide-react';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'candidate',
    profile: {
      bio: '',
      skills: '',
      resumeLink: '',
      companyName: '',
      website: ''
    }
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if it's a nested profile field
    if (['bio', 'skills', 'resumeLink', 'companyName', 'website'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Format skills if it's a candidate
    let submitData = { ...formData };
    if (submitData.role === 'candidate' && submitData.profile.skills) {
      // Split comma separated skills to array
      const skillsArray = typeof submitData.profile.skills === 'string' 
        ? submitData.profile.skills.split(',').map(s => s.trim())
        : submitData.profile.skills;
      
      submitData.profile.skills = skillsArray;
    }

    const result = await register(submitData);
    setIsLoading(false);
    
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 pt-20">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('candidate')}
              className={`flex-1 flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                formData.role === 'candidate' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 hover:border-primary-300 text-gray-500'
              }`}
            >
              <User className="h-6 w-6 mb-2" />
              <span className="font-medium">Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('recruiter')}
              className={`flex-1 flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                formData.role === 'recruiter' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 hover:border-primary-300 text-gray-500'
              }`}
            >
              <Building className="h-6 w-6 mb-2" />
              <span className="font-medium">Recruiter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Fields */}
            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {formData.role === 'candidate' ? 'Professional Details' : 'Company Details'}
            </h3>
            
            <div className="space-y-4">
              {formData.role === 'candidate' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.profile.bio}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Tell us about yourself..."
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 top-3 flex items-start pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="skills"
                        value={formData.profile.skills}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="React, Node.js, Python"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 top-3 flex items-start pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="resumeLink"
                        value={formData.profile.resumeLink}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="https://drive.google.com/..."
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 top-3 flex items-start pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="companyName"
                        value={formData.profile.companyName}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="Acme Corp"
                        required={formData.role === 'recruiter'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                    <input
                      name="website"
                      value={formData.profile.website}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://acmecorp.com"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 btn-primary text-base font-semibold"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
