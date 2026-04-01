const express = require('express');
const router = express.Router();
const { 
  applyForJob, 
  getMyApplications, 
  getJobApplications, 
  updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes for candidates
router.route('/me').get(protect, authorize('candidate'), getMyApplications);
router.route('/:jobId').post(protect, authorize('candidate'), applyForJob);

// Routes for recruiters
router.route('/job/:jobId').get(protect, authorize('recruiter'), getJobApplications);
router.route('/:id/status').put(protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
