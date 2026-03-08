import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Recipes.css';

const CommunityRecipes = () => {
  const { noviApi } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityRecipes = async () => {
      try {
        const response = await noviApi.get('/community_recepten');
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setRecipes(data);
      } catch (err) {
        console.error('Failed to fetch community recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityRecipes();
  }, [noviApi]);

  return (
    <div className="recipes-container container" style={{ display: 'block' }}>
      <main className="results" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Community Creations</h1>
          <p className="subtitle">Healthy recipes shared by our amazing users</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/add-recipe')}
            style={{ marginTop: '1.5rem', padding: '0.8rem 2rem' }}
          >
            Share Your Recipe
          </button>
        </div>

        {loading ? (
          <div className="loader">Loading community recipes...</div>
        ) : (
          <div className="recipe-grid">
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <div key={recipe.id} className="recipe-card glass" onClick={() => navigate(`/community/${recipe.id}`)}>
                  <div className="card-image">
                    {recipe.afbeeldingUrl ? (
                      <img src={recipe.afbeeldingUrl} alt={recipe.titel} />
                    ) : (
                      <div className="placeholder-img" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: 'rgba(255,255,255,0.05)' }}>
                        🍳
                      </div>
                    )}
                    <div className="card-badge">{recipe.bereidingstijd} min</div>
                  </div>
                  <div className="card-body">
                    <h3>{recipe.titel}</h3>
                    <div className="card-info">
                      <span>👤 {recipe.gebruikerNaam || 'Healthy Chef'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results glass" style={{ textAlign: 'center', padding: '4rem', width: '100%' }}>
                <h3>No community recipes yet</h3>
                <p>Be the first to share your healthy creation!</p>
                <button className="btn-primary" onClick={() => navigate('/add-recipe')} style={{ marginTop: '1rem' }}>
                  Share Now
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityRecipes;
