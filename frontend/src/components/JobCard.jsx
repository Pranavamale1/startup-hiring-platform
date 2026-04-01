import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building, MapPin, DollarSign, Clock } from 'lucide-react';

const JobCard = ({ job, hideApply = false }) => {
  return (
    <div className="card-hover">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
          </h3>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <Building className="h-4 w-4" />
            <span className="font-medium">{job.recruiterId?.profile?.companyName || 'Startup'}</span>
          </div>
        </div>
        {!hideApply && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
            Active
          </span>
        )}
      </div>

      <p className="text-gray-600 line-clamp-2 my-4 text-sm leading-relaxed">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          <span>{job.stipend}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired && job.skillsRequired.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
              {skill}
            </span>
          ))}
          {job.skillsRequired && job.skillsRequired.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs font-medium rounded-md">
              +{job.skillsRequired.length - 3}
            </span>
          )}
        </div>

        {!hideApply && (
           <Link to={`/jobs/${job._id}`} className="btn-primary py-2 px-4 shadow-sm group inline-flex items-center">
             View Role
           </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;
