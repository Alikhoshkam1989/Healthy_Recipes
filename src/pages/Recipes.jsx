import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchRecipes } from '../services/spoonacular';
import './Recipes.css';

const Recipes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: queryParams.get('query') || '',
    diet: queryParams.get('diet') || '',
    minProtein: queryParams.get('minProtein') || '',
    type: queryParams.get('type') || ''
  });

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { query, ...rest } = filters;
      const data = await searchRecipes(query, rest);
      setRecipes(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [location.search]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    navigate(`/recipes?${params.toString()}`);
  };

  return (
    <div className="recipes-container container">
      <aside className="sidebar glass">
        <h3>Filters</h3>
        <form onSubmit={applyFilters} className="filter-form">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              placeholder="e.g. Pasta"
            />
          </div>

          <div className="filter-group">
            <label>Diet</label>
            <select value={filters.diet} onChange={(e) => handleFilterChange('diet', e.target.value)}>
              <option value="">Any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten Free</option>
              <option value="ketogenic">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="">Any</option>
              <option value="main course">Main Course</option>
              <option value="breakfast">Breakfast</option>
              <option value="dessert">Dessert</option>
              <option value="salad">Salad</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Protein (g)</label>
            <input
              type="number"
              value={filters.minProtein}
              onChange={(e) => handleFilterChange('minProtein', e.target.value)}
              placeholder="30"
            />
          </div>

          <button type="submit" className="btn-primary apply-btn">Apply Filters</button>
        </form>
      </aside>

      <main className="results">
        <h2 className="results-title">
          {filters.query ? `Results for "${filters.query}"` : 'Browse Recipes'}
        </h2>

        {loading ? (
          <div className="loader">Searching for the best recipes...</div>
        ) : (
          <div className="recipe-grid">
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <div key={recipe.id} className="recipe-card glass" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                  <div className="card-image">
                    <img src={recipe.image} alt={recipe.title} />
                  </div>
                  <div className="card-body">
                    <h3>{recipe.title}</h3>
                    <div className="card-info">
                      <span>⚡ {Math.round(recipe.nutrition?.nutrients[0]?.amount || 0)} kcal</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No recipes found matching your filters.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Recipes;
