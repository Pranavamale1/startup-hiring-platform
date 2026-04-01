import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, LogOut, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full glass-header z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-900">
                StartupHire
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                {user.role === 'recruiter' && (
                  <Link to="/post-job" className="btn-primary text-sm flex items-center gap-2">
                    Post a Job
                  </Link>
                )}
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <span>{user.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
