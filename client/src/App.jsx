import React, { useState } from 'react'; // Importação essencial
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          } 
        />
        <Route 
          path="/login" 
          element={
            // Proteção extra: se já estiver logado, não deixa ir pra tela de login de novo
            !isLoggedIn ? (
              <Login setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;