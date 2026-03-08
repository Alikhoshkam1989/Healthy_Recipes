import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomRecipes } from '../services/spoonacular';
import './Home.css';

const Home = () => {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const recipes = await getRandomRecipes(6);
        setFeatured(recipes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/recipes?query=${search}`);
    }
  };

  return (
    <div className="home-container">
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">Fuel Your Body with <span className="gradient-text">Healthy</span> Recipes</h1>
          <p className="hero-subtitle">Discover thousands of recipes tailored to your diet and nutritional needs.</p>

          <form onSubmit={handleSearch} className="search-box glass">
            <input
              type="text"
              placeholder="Search for ingredients or dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>

          <div className="quick-tags">
            <button onClick={() => navigate('/recipes?diet=vegetarian')}>Vegetarian</button>
            <button onClick={() => navigate('/recipes?diet=vegan')}>Vegan</button>
            <button onClick={() => navigate('/recipes?diet=gluten-free')}>Gluten Free</button>
            <button onClick={() => navigate('/recipes?minProtein=30')}>High Protein</button>
          </div>
        </div>
      </section>

      <section className="featured-section container">
        <h2 className="section-title">Healthy Inspiration</h2>
        <div className="recipe-grid">
          {loading ? (
            <p>Loading inspiration...</p>
          ) : (
            featured.map(recipe => (
              <div key={recipe.id} className="recipe-card glass" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                <div className="card-image">
                  <img src={recipe.image} alt={recipe.title} />
                  <div className="card-badge">{recipe.readyInMinutes} min</div>
                </div>
                <div className="card-body">
                  <h3>{recipe.title}</h3>
                  <div className="card-info">
                    <span>🔥 {Math.round(recipe.nutrition?.nutrients[0]?.amount || 0)} kcal</span>
                    <span>🥗 {recipe.dishTypes?.[0] || 'Main'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
