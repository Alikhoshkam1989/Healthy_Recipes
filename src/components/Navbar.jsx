import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <span className="gradient-text">Healthy</span>Recipes
        </Link>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/recipes" onClick={() => setIsOpen(false)}>Recipes</Link>
          <Link to="/community" onClick={() => setIsOpen(false)}>Community</Link>
          {user ? (
            <>
              <Link to="/add-recipe" className="btn-add-nav" onClick={() => setIsOpen(false)}>+ Share Recipe</Link>
              <Link to="/favorites" onClick={() => setIsOpen(false)}>My Saved</Link>
              <Link to="/profile" className="user-name" onClick={() => setIsOpen(false)}>
                {user.username}
              </Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="btn-register" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          )}
        </div>

        <div className="mobile-menu" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
