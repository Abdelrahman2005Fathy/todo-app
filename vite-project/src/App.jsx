import React, {
  useEffect,
  useState,
} from 'react';

const TodoApp = () => {
  // States
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/todos';
  
  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const addTask = async () => {
    if (!task.trim()) return;
    
    const newTask = {
      text: task,
      completed: false
    };

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newTask)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      
      const savedTask = await response.json();
      setTasks([...tasks, savedTask]);
      setTask('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id) => {
    try {
      setLoading(true);
      const taskToUpdate = tasks.find(task => task._id === id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          completed: !taskToUpdate.completed 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task._id === id ? updatedTask : task
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Todo App</h1>
        
        {/* Input Section */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Add a new task..."
            disabled={loading}
          />
          <button
            onClick={addTask}
            disabled={loading || !task.trim()}
            className={`px-4 py-2 rounded-lg transition-colors ${
              loading || !task.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Tasks List */}
        {loading && tasks.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No tasks found</div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                  task.completed
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span
                  onClick={() => toggleComplete(task._id)}
                  className={`flex-1 cursor-pointer ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task._id)}
                  disabled={loading}
                  className="text-red-500 hover:text-red-700 text-xl font-bold disabled:opacity-50"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tasks Counter */}
        {tasks.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            {tasks.filter(t => !t.completed).length} of {tasks.length} tasks remaining
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;