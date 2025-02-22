import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CapitalCityGuesser from './pages/CapitalCityGuesser'
import './App.css'
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        toastOptions={{
          style: {
            background: '#2D3748',
            color: '#E2E8F0',
            border: '1px solid #4A5568',
          },
          success: {
            iconTheme: {
              primary: '#48BB78',
              secondary: '#2D3748',
            },
          },
        }}
      />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/capital-city-guesser">Capital City Guesser</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/capital-city-guesser" element={<CapitalCityGuesser />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
