import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RecipeDetail.css';

const CommunityRecipeDetail = () => {
  const { id } = useParams();
  const { user, noviApi } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const response = await noviApi.get(`/community_recepten/${id}`);
        // Response normalization
        const data = response.data?.data || response.data;
        if (!data) throw new Error('Recipe not found');
        setRecipe(data);
      } catch (err) {
        console.error('Failed to fetch community recipe details:', err);
        setError('Could not load community recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [id, noviApi]);

  if (loading) return <div className="container loader">Loading community recipe...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!recipe) return null;

  return (
    <div className="recipe-detail-container container">
      <header className="recipe-header">
        <div className="recipe-image-wrap glass">
          {recipe.afbeeldingUrl ? (
            <img src={recipe.afbeeldingUrl} alt={recipe.titel} />
          ) : (
            <div className="placeholder-img" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', background: 'rgba(255,255,255,0.05)' }}>
              🍳
            </div>
          )}
        </div>
        <div className="recipe-intro">
          <h1 className="gradient-text">{recipe.titel}</h1>
          <div className="recipe-meta">
            <span>⏲️ {recipe.bereidingstijd} min</span>
            <span>👤 Shared by {recipe.gebruikerNaam || 'Healthy Chef'}</span>
          </div>
          <p className="recipe-description" style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            {recipe.beschrijving}
          </p>
        </div>
      </header>

      <div className="recipe-content">
        <section className="ingredients glass">
          <h2>Ingredients</h2>
          <ul style={{ listStyle: 'disc', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
            {recipe.ingredienten.split('\n').map((ing, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{ing}</li>
            ))}
          </ul>
        </section>

        <section className="instructions glass">
          <h2>Preparation</h2>
          <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {recipe.instructies}
          </div>
        </section>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="btn-primary" onClick={() => navigate('/community')}>
          Back to Community
        </button>
      </div>
    </div>
  );
};

export default CommunityRecipeDetail;
