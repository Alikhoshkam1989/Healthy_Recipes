import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeDetails } from '../services/spoonacular';
import { useAuth } from '../context/AuthContext';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user, noviApi } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getRecipeDetails(id);
        setRecipe(data);

        // Check if already favorited if user is logged in
        if (user) {
          try {
            const favResponse = await noviApi.get('/favorieten');
            const favs = Array.isArray(favResponse.data) ? favResponse.data : (favResponse.data?.data || []);
            const isFav = favs.some(f => (f.receptId || f.ReceptId) === id);
            setFavorited(isFav);
          } catch (favErr) {
            console.warn('Failed to fetch favorites check:', favErr);
          }
        }
      } catch (err) {
        console.error('Spoonacular load error for ID:', id, err);
        setError(`Could not load recipe details for ID: ${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSaveFavorite = async () => {
    if (!user) return navigate('/login');
    setSaving(true);
    try {
      // Get highest ID as number
      const response = await noviApi.get('/favorieten');
      const favs = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      const nextId = favs.length > 0 ? Math.max(...favs.map(f => Number(f.id))) + 1 : 1;

      await noviApi.post('/favorieten', {
        id: nextId,
        receptId: String(id),
        receptTitel: recipe.title,
        afbeeldingUrl: recipe.image,
        gebruikerId: String(user.id || user.email)
      });
      setFavorited(true);
    } catch (err) {
      console.error('Failed to save favorite:', err.response?.data || err);
      alert(`Could not save favorite: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      const response = await noviApi.get('/recensies');
      const recs = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      const nextId = recs.length > 0 ? Math.max(...recs.map(r => Number(r.id))) + 1 : 1;

      await noviApi.post('/recensies', {
        id: nextId,
        receptId: String(id),
        beoordeling: Number(review.rating),
        opmerking: review.comment,
        gebruikerId: String(user.id || user.email),
        aangemaaktOp: new Date().toISOString().split('T')[0]
      });
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Failed to submit review:', err.response?.data || err);
    }
  };

  if (loading) return <div className="container loader">Loading recipe details...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="recipe-detail-container container">
      <header className="recipe-header">
        <div className="recipe-image-wrap glass">
          <img src={recipe.image} alt={recipe.title} />
        </div>
        <div className="recipe-intro">
          <h1 className="gradient-text">{recipe.title}</h1>
          <div className="recipe-meta">
            <span>⏲️ {recipe.readyInMinutes} min</span>
            <span>🍽️ {recipe.servings} servings</span>
            <span>🔥 {Math.round(recipe.nutrition?.nutrients[0]?.amount || 0)} kcal</span>
          </div>

          <div className="diet-badges">
            {recipe.vegetarian && <span className="badge">Vegetarian</span>}
            {recipe.vegan && <span className="badge">Vegan</span>}
            {recipe.glutenFree && <span className="badge">Gluten Free</span>}
            {recipe.veryHealthy && <span className="badge highlight">Very Healthy</span>}
          </div>

          <button
            className={`btn-primary save-btn ${favorited ? 'favorited' : ''}`}
            onClick={handleSaveFavorite}
            disabled={saving || favorited}
          >
            {saving ? 'Saving...' : favorited ? '❤️ Saved to Favorites' : '♡ Save to Favorites'}
          </button>
        </div>
      </header>

      <div className="recipe-content">
        <section className="ingredients glass">
          <h2>Ingredients</h2>
          <ul>
            {recipe.extendedIngredients.map((ing, idx) => (
              <li key={idx}>
                <strong>{ing.amount} {ing.unit}</strong> {ing.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="instructions glass">
          <h2>Instructions</h2>
          <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        </section>

        <section className="nutrition glass">
          <h2>Nutrition Facts</h2>
          <div className="nutrition-grid">
            {recipe.nutrition.nutrients.slice(0, 8).map((nut, idx) => (
              <div key={idx} className="nut-item">
                <span className="nut-name">{nut.name}</span>
                <span className="nut-amount">{Math.round(nut.amount)}{nut.unit}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="reviews-section glass">
        <h2>Reviews & Feedback</h2>
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="form-group">
            <label>Rating (1-5)</label>
            <input
              type="number" min="1" max="5"
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              placeholder="What did you think of this recipe?"
              required
            />
          </div>
          <button type="submit" className="btn-primary">Post Review</button>
        </form>
      </section>
    </div>
  );
};

export default RecipeDetail;
