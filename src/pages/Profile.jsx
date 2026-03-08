import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-container container">
      <div className="profile-header glass">
        <div className="profile-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h1 className="gradient-text">{user.username}</h1>
        <p>{user.email}</p>
        <button className="btn-logout-alt" onClick={logout}>Logout</button>
      </div>

      <div className="profile-details glass">
        <h2>Account Settings</h2>
        <div className="settings-list">
          <div className="setting-item">
            <span>Email Notifications</span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>Dark Mode</span>
            <label className="switch">
              <input type="checkbox" defaultChecked disabled />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
