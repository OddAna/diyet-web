import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import RecipeDetail from './recipe-detail.jsx'
import Layout from './layout.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route path="/recipe/:slug" element={<RecipeDetail />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
