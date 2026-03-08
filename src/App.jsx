import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import CommunityRecipes from './pages/CommunityRecipes'
import AddRecipe from './pages/AddRecipe'
import CommunityRecipeDetail from './pages/CommunityRecipeDetail'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/community" element={<CommunityRecipes />} />
          <Route path="/community/:id" element={<CommunityRecipeDetail />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
