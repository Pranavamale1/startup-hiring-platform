import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, FileText, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stipend: '',
    skillsRequired: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // split skills
      const skillsArray = typeof formData.skillsRequired === 'string'
        ? formData.skillsRequired.split(',').map(s => s.trim())
        : formData.skillsRequired;
      
      await api.post('/jobs', {
        ...formData,
        skillsRequired: skillsArray
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary-600" />
          Post a New Opportunity
        </h1>
        <p className="text-gray-500 mt-2">Create a listing to find the perfect candidate for your team.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Software Engineer Intern"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  required
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stipend / Salary</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="stipend"
                    required
                    value={formData.stipend}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="$2000/month or Unpaid"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Comma separated)</label>
                <input
                  name="skillsRequired"
                  required
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="React, Node.js, Mongoose"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? 'Posting...' : 'Publish Job Listing'}
              {!loading && <CheckCircle className="h-5 w-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
