import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Favorites.css';

const Favorites = () => {
  const { user, noviApi } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await noviApi.get('/favorieten');

        // Normalize response: handle both { data: [...] } and direct array
        const rawData = Array.isArray(response.data) ? response.data : (response.data?.data || []);

        // Defensive mapping for property casing and structure
        const normalizedData = rawData.map(item => ({
          id: item.id || item.Id,
          receptId: item.receptId || item.ReceptId || item.recipeId,
          receptTitel: item.receptTitel || item.ReceptTitel || item.title,
          afbeeldingUrl: item.afbeeldingUrl || item.AfbeeldingUrl || item.image
        }));

        setFavorites(normalizedData.filter(f => f.receptId)); // Ensure we have an ID to navigate with
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  const removeFavorite = async (id) => {
    try {
      await noviApi.delete(`/favorieten/${id}`);
      setFavorites(favorites.filter(f => f.id !== id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="favorites-container container">
      <h1 className="gradient-text">My Saved Recipes</h1>
      <p className="subtitle">Your personal collection of healthy meals</p>

      {loading ? (
        <div className="loader">Loading your collection...</div>
      ) : (
        <div className="favorites-grid">
          {favorites.length > 0 ? (
            favorites.map(fav => (
              <div key={fav.id || fav.receptId} className="fav-card glass">
                <div className="card-image" onClick={() => navigate(`/recipe/${fav.receptId}`)}>
                  <img src={fav.afbeeldingUrl} alt={fav.receptTitel} />
                </div>
                <div className="card-body">
                  <h3>{fav.receptTitel}</h3>
                  <div className="card-actions">
                    <button className="btn-view" onClick={() => navigate(`/recipe/${fav.receptId}`)}>View Recipe</button>
                    <button className="btn-remove" onClick={() => removeFavorite(fav.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-favorites glass">
              <h3>No saved recipes yet</h3>
              <p>Start exploring and save your favorite healthy meals!</p>
              <button className="btn-primary" onClick={() => navigate('/recipes')}>Browse Recipes</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;
