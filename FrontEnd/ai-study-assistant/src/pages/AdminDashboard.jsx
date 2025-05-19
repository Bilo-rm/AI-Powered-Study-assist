import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

// User Form Component
const UserForm = ({ user, onSubmit, onCancel, currentAdmin }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '', // Empty by default, even when editing
    role: user?.role || 'user'
  });

  // Check if this is the admin's own account
  const isOwnAccount = currentAdmin?.id === user?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only include password if it's not empty (for updates)
    const dataToSubmit = {...formData};
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }
    onSubmit(dataToSubmit);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {user ? (isOwnAccount ? 'Edit Your Account' : 'Change User Role') : 'Create New User'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={!isOwnAccount && user}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={!isOwnAccount && user}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Password {user && '(Leave blank to keep current password)'}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={!isOwnAccount && user}
            required={!user}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {user ? (isOwnAccount ? 'Update Account' : 'Update Role') : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/user/users');
      // Make sure response.data is an array before setting state
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        // If response.data is not an array, initialize users as empty array
        console.error('Expected array but got:', response.data);
        setUsers([]);
        setError('Received invalid data format from server');
        toast.error('Error: Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
      setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new user
  const createUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/user/users', userData);
      toast.success('User created successfully');
      fetchUsers();
      setShowForm(false);
    } catch (err) {
      toast.error('Failed to create user: ' + (err.response?.data?.message || err.message));
    }
  };

  // Update existing user
  const updateUser = async (userData) => {
    try {
      // Check if this is the admin's own account
      const isOwnAccount = user.id === currentUser.id;
      
      // If not own account, only update role
      if (!isOwnAccount) {
        userData = { role: userData.role };
      }
      
      const response = await axios.put(`http://localhost:5000/user/users/${currentUser.id}`, userData);
      
      toast.success(isOwnAccount ? 
        'Your account updated successfully' : 
        `User role updated to ${userData.role}`
      );
      
      fetchUsers();
      setShowForm(false);
      setCurrentUser(null);
    } catch (err) {
      toast.error('Failed to update user: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete user
  // Modify your deleteUser function to capture more error information
const deleteUser = async (userId) => {
  // Prevent deleting own account
  if (userId === user.id) {
    toast.error("You cannot delete your own account");
    return;
  }
  
  if (!window.confirm('Are you sure you want to delete this user?')) return;

  try {
    await axios.delete(`http://localhost:5000/user/users/${userId}`);
    toast.success('User deleted successfully');
    fetchUsers();
  } catch (err) {
    // Log the full error response for debugging
    console.error('Delete error details:', err.response);
    // Show more detailed error message if available
    const errorMessage = err.response?.data?.message || 
                        err.response?.data?.error || 
                        err.message || 
                        'Unknown server error';
    toast.error(`Failed to delete user: ${errorMessage}`);
  }
};

  // Handle form submission
  const handleSubmit = (formData) => {
    if (currentUser) {
      updateUser(formData);
    } else {
      createUser(formData);
    }
  };

  // Reset form state
  const handleCancel = () => {
    setShowForm(false);
    setCurrentUser(null);
  };

  // Edit user
  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-gray-700">
              {user?.name}
              <span className="ml-2 text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-1">
                Admin
              </span>
            </div>
            <button
              onClick={() => handleEdit(user)}
              className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-100"
            >
              Edit Account
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            {!showForm && (
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add New User
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {showForm ? (
            <UserForm 
              user={currentUser} 
              onSubmit={handleSubmit} 
              onCancel={handleCancel}
              currentAdmin={user}
            />
          ) : (
            <>
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        // Make sure users is an array before calling map
                        Array.isArray(users) && users.map((userItem) => (
                          <tr key={userItem.id} className={userItem.id === user.id ? "bg-blue-50" : ""}>
                            <td className="px-6 py-4 whitespace-nowrap">{userItem.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{userItem.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                userItem.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {userItem.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(userItem.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(userItem)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                {userItem.id === user.id ? 'Edit Account' : 'Change Role'}
                              </button>
                              {userItem.id !== user.id && (
                                <button
                                  onClick={() => deleteUser(userItem.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;