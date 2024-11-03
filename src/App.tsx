// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TamagotchiDashboard from './components/tamagotchi-dashboard';
import PlatformGame from './components/mini-game';
import Background from './components/ui/Background';
import './styles/globals.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPlatformGame = () => {
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Router>
        <Background />

        <div id="content">
          <Routes>
            <Route 
              path="/" 
              element={
                <TamagotchiDashboard 
                  openMiniGame={handleOpenPlatformGame} // Pasamos la función para abrir el juego
                />
              } 
            />
          </Routes>
        </div>

        {/* Renderizamos PlatformGame fuera de Routes para que esté disponible en cualquier ruta */}
        <PlatformGame 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      </Router>
    </div>
  );
}

export default App;
