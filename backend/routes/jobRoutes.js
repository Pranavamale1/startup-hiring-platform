const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, getRecruiterJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter'), createJob);

router.get('/me', protect, authorize('recruiter'), getRecruiterJobs);

router.route('/:id')
  .get(getJobById);

module.exports = router;
