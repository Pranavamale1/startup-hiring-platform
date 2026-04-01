const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      jobId,
      candidateId: req.user._id
    });

    if (alreadyApplied) {
      res.status(400);
      return next(new Error('You have already applied for this job'));
    }

    const application = await Application.create({
      jobId,
      candidateId: req.user._id
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('You have already applied for this job'));
    }
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/me
// @access  Private (Candidate only)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate('jobId', 'title stipend recruiterId status')
      .sort('-appliedAt');
      
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to view these applications'));
    }

    const applications = await Application.find({ jobId })
      .populate('candidateId', 'name email profile.resumeLink profile.skills')
      .sort('-appliedAt');

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      res.status(404);
      return next(new Error('Application not found'));
    }

    // Verify job belongs to recruiter
    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this application'));
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
};
