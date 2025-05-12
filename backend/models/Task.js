const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateCompleted: Date,
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
