const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { projectId, title, description } = req.body;
  try {
    const task = await Task.create({ project: projectId, title, description });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const { projectId } = req.query;
  try {
    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;

  const updateFields = { title, description, status };
  if (status === 'completed') {
    updateFields.dateCompleted = new Date();
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};
