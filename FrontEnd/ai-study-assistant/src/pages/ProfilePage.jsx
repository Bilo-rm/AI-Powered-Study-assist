import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import axios from "axios";

function ProfilePage() {
  const { user, logout } = useAuth(); // Remove setUser if it's not provided by your context
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [editing, setEditing] = useState(false);

  // Fetch profile data from the API
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setProfileData(response.data);
        setFormData(prevState => ({
          ...prevState,
          name: response.data.name || "",
          email: response.data.email || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
      }
    }
  };

  useEffect(() => {
    // Try to fetch profile data directly from API
    fetchProfileData();
    
    // Fallback to user data from context if API fetch fails
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const toggleEdit = () => {
    setEditing(!editing);
    // Reset password fields when toggling edit mode
    if (!editing) {
      setFormData(prevState => ({
        ...prevState,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }
  };

  const validateForm = () => {
    // Always require name and email
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    // Only validate password fields if any password field is filled
    const isChangingPassword = formData.currentPassword || formData.newPassword || formData.confirmPassword;
    
    if (isChangingPassword) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to change password");
        return false;
      }

      if (!formData.newPassword) {
        toast.error("New password is required");
        return false;
      }

      if (formData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords don't match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const toastId = toast.loading("Updating profile...");
    setLoading(true);
    
    try {
      // Prepare data for API - only include password fields if changing password
      const payload = {
        name: formData.name,
        email: formData.email
      };
      
      if (formData.currentPassword && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
      
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/api/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update was successful - show message and update UI
      toast.dismiss(toastId);
      toast.success("Profile updated successfully");
      
      // Fetch the updated profile data
      fetchProfileData();
      
      setEditing(false);
      
      // Optionally update the local state to reflect the changes immediately
      if (response.data && response.data.user) {
        setFormData(prevState => ({
          ...prevState,
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      } else {
        // Reset password fields only
        setFormData(prevState => ({
          ...prevState,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      toast.dismiss(toastId);
      
      // Show specific error message if available
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 401) {
        toast.error("Authentication error. Please log in again.");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-purple-900">Your Profile</h2>
          <div className="flex space-x-2">
            <button
              onClick={fetchProfileData}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center"
              title="Refresh profile data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={toggleEdit}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                editing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {!editing ? (
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <div className="h-16 w-16 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 text-2xl font-semibold">
                {profileData?.name ? profileData.name.charAt(0).toUpperCase() : 
                 user?.name ? user.name.charAt(0).toUpperCase() : 
                 profileData?.email ? profileData.email.charAt(0).toUpperCase() :
                 user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{profileData?.name || user?.name || "No name set"}</h3>
                <p className="text-gray-600">{profileData?.email || user?.email}</p>
                {(profileData?.role || user?.role) && <p className="text-sm text-gray-500 mt-1">Role: {profileData?.role || user?.role}</p>}
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">ACCOUNT DETAILS</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{profileData?.name || user?.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profileData?.email || user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium">
                    {(profileData?.createdAt || user?.createdAt) 
                      ? new Date(profileData?.createdAt || user?.createdAt).toLocaleDateString("en-US", { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your email"
              />
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
              <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change your password.</p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your current password"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="New password"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={toggleEdit}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg mr-2 hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={fetchProfileData}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg mr-2 hover:bg-blue-200"
                disabled={loading}
                type="button"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </div>
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Optional: Security Tips Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Security Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-sm text-gray-600">Use a strong, unique password that you don't use elsewhere.</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-sm text-gray-600">Consider using a password manager to generate and store complex passwords.</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-sm text-gray-600">Change your password regularly, especially if you suspect any security issues.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;