const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const projectCount = await Project.countDocuments({ user: userId });
    if (projectCount >= 4) {
      return res.status(400).json({ message: 'Project limit (4) reached.' });
    }

    const project = await Project.create({ name, user: userId });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
