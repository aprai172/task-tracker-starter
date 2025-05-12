import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import PageWrapper from '../components/common/PageWrapper';

interface Project {
  _id: string;
  name: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName) return;
    try {
      const res = await API.post(
        '/projects',
        { name: newProjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects([...projects, res.data]);
      setNewProjectName('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not create project');
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Your Projects</h1>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <div className="flex mb-4 gap-2">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name"
            className="p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createProject}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="p-4 bg-gray-50 border rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition"
              >
                {project.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
