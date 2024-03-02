import React from 'react';
import './App.css';
import MapComponent from './MapComponent';
import Dashboard from './Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';



function App() {

  return (
    <Router>
      <div className="App">
        < Navbar/>
        <Routes>
          <Route path="/" element={<MapComponent />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;