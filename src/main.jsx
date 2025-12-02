import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './Layout'
import Home from './pages/Home'
import Closet from './pages/Closet'
import Lookbook from './pages/Lookbook'
import Studio from './pages/Studio'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/studio" element={<Studio />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
)
