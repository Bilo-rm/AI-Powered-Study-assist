import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function AdminDashboard() {
  const { auth, logout } = useContext(AuthContext);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, Admin {auth.user?.name}!</h2>
        <p className="text-gray-600 mb-4">
          Manage users and system settings from this admin dashboard.
        </p>
        
        {/* Admin-specific content would go here */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="font-medium">User Management</h3>
            <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
          </div>
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="font-medium">System Settings</h3>
            <p className="text-sm text-gray-600">Configure application settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
