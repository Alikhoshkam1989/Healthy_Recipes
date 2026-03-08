import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const AddRecipe = () => {
  const { user, noviApi } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titel: '',
    beschrijving: '',
    ingredienten: [{ amount: '', name: '' }],
    instructies: '',
    bereidingstijd: 30,
    afbeeldingUrl: ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredienten: [...prev.ingredienten, { amount: '', name: '' }]
    }));
  };

  const handleRemoveIngredient = (index) => {
    if (formData.ingredienten.length === 1) return;
    setFormData(prev => ({
      ...prev,
      ingredienten: prev.ingredienten.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredienten];
    newIngredients[index][field] = value;
    setFormData(prev => ({ ...prev, ingredienten: newIngredients }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format ingredients to a clean string for the API
      const ingredientString = formData.ingredienten
        .filter(ing => ing.name.trim() !== '')
        .map(ing => `${ing.amount} ${ing.name}`.trim())
        .join('\n');

      // Get highest ID as number
      const response = await noviApi.get('/community_recepten');
      const recipes = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      const nextId = recipes.length > 0 ? Math.max(...recipes.map(r => Number(r.id))) + 1 : 1;

      const payload = {
        ...formData,
        ingredienten: ingredientString,
        id: nextId,
        gebruikerId: String(user.id || user.email),
        gebruikerNaam: user.username || user.email
      };

      await noviApi.post('/community_recepten', payload);
      navigate('/community');
    } catch (err) {
      console.error('Full Error Details:', err.response?.data || err);
      console.error('Status Code:', err.response?.status);
      alert(`Failed to save recipe: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bereidingstijd' ? parseInt(value) : value
    }));
  };

  return (
    <div className="auth-container container">
      <div className="auth-card glass" style={{ maxWidth: '800px' }}>
        <h1 className="gradient-text">Share Your Recipe</h1>
        <p>Help others lead a healthier life with your creations.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="titel"
              value={formData.titel}
              onChange={handleChange}
              placeholder="e.g. Avocado Toast Deluxe"
              required
            />
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <input
              type="text"
              name="beschrijving"
              value={formData.beschrijving}
              onChange={handleChange}
              placeholder="A brief summary of your dish"
              required
            />
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            {formData.ingredienten.map((ing, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input
                  style={{ flex: '1' }}
                  type="text"
                  placeholder="Amount (e.g. 200g)"
                  value={ing.amount}
                  onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                />
                <input
                  style={{ flex: '3' }}
                  type="text"
                  placeholder="Ingredient (e.g. Avocado)"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                  required
                />
                {formData.ingredienten.length > 1 && (
                  <button
                    type="button"
                    className="btn-logout"
                    style={{ padding: '0.4rem 0.8rem', border: 'none', color: '#ff6b6b' }}
                    onClick={() => handleRemoveIngredient(idx)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-add-nav"
              onClick={handleAddIngredient}
              style={{ marginTop: '0.5rem', width: 'fit-content' }}
            >
              + Add Ingredient
            </button>
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea
              name="instructies"
              value={formData.instructies}
              onChange={handleChange}
              placeholder="Describe how to prepare it..."
              required
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Cooking Time (minutes)</label>
            <input
              type="number"
              name="bereidingstijd"
              value={formData.bereidingstijd}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="url"
              name="afbeeldingUrl"
              value={formData.afbeeldingUrl}
              onChange={handleChange}
              placeholder="Link to an image of your dish"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sharing...' : 'Share Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
