import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CapitalCityGuesser from './pages/CapitalCityGuesser'
import './App.css'

function App() {
  return (
    <BrowserRouter>
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
