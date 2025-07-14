import React from 'react'
import { Route, Routes } from 'react-router-dom'
import About from './pages/About.jsx'
import QRVisualization from './components/QRVisualization.jsx'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path='/about' element={<About/>} />
        <Route path='/' element={<QRVisualization/>} />
      </Routes>
    </div>
  )
} 

export default App
