import axios from 'axios';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

const spoonApi = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY
  }
});

const MOCK_RECIPES = [
  {
    id: 716429,
    title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
    image: "https://spoonacular.com/recipeImages/716429-312x231.jpg",
    readyInMinutes: 45,
    servings: 2,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    veryHealthy: true,
    nutrition: { nutrients: [{ name: "Calories", amount: 584, unit: "kcal" }] },
    dishTypes: ["lunch", "main course", "dinner"],
    extendedIngredients: [{ amount: 2, unit: "cloves", name: "garlic" }, { amount: 1, unit: "head", name: "cauliflower" }],
    instructions: "<p>Cook pasta according to package directions. Sauté garlic and cauliflower in olive oil until tender...</p>"
  },
  {
    id: 715538,
    title: "What to expect from your favorite hen",
    image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
    readyInMinutes: 30,
    servings: 1,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    veryHealthy: true,
    nutrition: { nutrients: [{ name: "Calories", amount: 450, unit: "kcal" }] },
    dishTypes: ["dinner"],
    extendedIngredients: [{ amount: 1, unit: "lb", name: "chicken breast" }],
    instructions: "<p>Grill chicken until cooked through. Serve with fresh greens.</p>"
  }
];

export const searchRecipes = async (query, filters = {}) => {
  try {
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        cleanFilters[key] = filters[key];
      }
    });

    const response = await spoonApi.get('/recipes/complexSearch', {
      params: {
        query,
        number: 12,
        addRecipeInformation: true,
        ...cleanFilters
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 402 || error.response?.status === 429) {
      console.warn('Spoonacular quota exceeded, using mock fallback.');
      return { results: MOCK_RECIPES, totalResults: MOCK_RECIPES.length };
    }
    console.error('Spoonacular Search Error:', error);
    throw error;
  }
};

export const getRecipeDetails = async (id) => {
  try {
    const response = await spoonApi.get(`/recipes/${id}/information`, {
      params: {
        includeNutrition: true
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 402 || error.response?.status === 429) {
      console.warn('Spoonacular quota exceeded, using mock details.');
      const mock = MOCK_RECIPES.find(r => r.id.toString() === id.toString()) || MOCK_RECIPES[0];
      return mock;
    }
    console.error('Spoonacular Details Error:', error);
    throw error;
  }
};

export const getRandomRecipes = async (number = 6) => {
  try {
    const response = await spoonApi.get('/recipes/random', {
      params: {
        number,
        tags: 'healthy'
      }
    });
    return response.data.recipes;
  } catch (error) {
    if (error.response?.status === 402 || error.response?.status === 429) {
      console.warn('Spoonacular quota exceeded, using mock random.');
      return MOCK_RECIPES.slice(0, number);
    }
    console.error('Spoonacular Random Error:', error);
    throw error;
  }
};
