import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import PageWrapper from '../components/common/PageWrapper';
import { motion } from 'framer-motion';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in progress' | 'completed';
  dateCreated: string;
  dateCompleted?: string;
}

const ProjectTasks = () => {
  const { id: projectId } = useParams();
  const token = localStorage.getItem('token');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    if (!title) return;
    try {
      const res = await API.post(
        '/tasks',
        { title, description, projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not create task');
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const res = await API.put(
        `/tasks/${taskId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(t => (t._id === taskId ? res.data : t)));
    } catch (err: any) {
      setError('Update failed');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await API.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err: any) {
      setError('Delete failed');
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Tasks</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            className="p-2 border rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="p-2 border rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button
            onClick={createTask}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <ul>
            {tasks.map((task, index) => (
              <motion.li
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg p-4 mb-3 bg-gray-50 shadow hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg mb-1">{task.title}</h3>
                <p className="text-sm text-gray-700 mb-1">{task.description}</p>
                <p className="text-sm text-blue-500 mb-1">Status: {task.status}</p>
                <p className="text-xs text-gray-400">Created: {new Date(task.dateCreated).toLocaleDateString()}</p>
                {task.dateCompleted && (
                  <p className="text-xs text-gray-400">Completed: {new Date(task.dateCompleted).toLocaleDateString()}</p>
                )}
                <div className="mt-2 flex gap-2">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => updateTaskStatus(task._id, 'completed')}
                      className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Mark as Completed
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </PageWrapper>
  );
};

export default ProjectTasks;