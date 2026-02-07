import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, 
  Mail, 
  Building2, 
  Shield, 
  Calendar,
  Save,
  Edit2,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.put('/auth/updateprofile', formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update user context if needed
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      company: user.company || ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and company information</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 animate-fadeIn flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 animate-fadeIn flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                <span className="capitalize font-medium">{user?.role}</span> Account
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing || loading}
                className="input-field disabled:bg-gray-50 disabled:text-gray-700"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing || loading}
                className="input-field disabled:bg-gray-50 disabled:text-gray-700"
                placeholder="your@email.com"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={!isEditing || loading}
                className="input-field disabled:bg-gray-50 disabled:text-gray-700"
                placeholder="Your company name"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Account Role
              </label>
              <input
                type="text"
                value={user?.role || ''}
                disabled
                className="input-field disabled:bg-gray-50 disabled:text-gray-700 capitalize"
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Information */}
      <div className="card animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Account Status</p>
              <p className="text-base font-semibold text-green-600 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Security & Privacy</h4>
            <p className="text-sm text-gray-600">
              Your data is encrypted and secure. We use httpOnly cookies for authentication 
              and never store sensitive information in browser storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
