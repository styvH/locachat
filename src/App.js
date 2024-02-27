import React, { useState } from 'react';
import './App.css';
import MapComponent from './MapComponent';
import SignupForm from './SignupForm';
import SignInForm from './SignInForm'; 
import Dashboard from './Dashboard';
import LogoutButton from './LogoutButton';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from './Navbar';


function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userPseudo = Cookies.get('userPseudo'); // Lire le pseudo de l'utilisateur à partir des cookies
  
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/" element={<MapComponent />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
