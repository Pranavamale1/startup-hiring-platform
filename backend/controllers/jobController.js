const Job = require('../models/Job');

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .populate('recruiterId', 'name profile.companyName')
      .sort('-createdAt');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiterId', 'name profile.companyName profile.website');
      
    if (job) {
      res.json(job);
    } else {
      res.status(404);
      next(new Error('Job not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
const createJob = async (req, res, next) => {
  try {
    const { title, description, stipend, skillsRequired } = req.body;

    const job = new Job({
      title,
      description,
      stipend,
      skillsRequired,
      recruiterId: req.user._id
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by the logged-in recruiter
// @route   GET /api/jobs/me
// @access  Private (Recruiter only)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort('-createdAt');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  getRecruiterJobs
};
