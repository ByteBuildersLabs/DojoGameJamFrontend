import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TamagotchiDashboard from './components/tamagotchi-dashboard';
import Background from './components/ui/Background';
import './styles/globals.css';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Router>
        {/* Background component, which applies a video background */}
        <Background />

        <div id="content">
          <Routes>
            {/* Define routes here, including your main game route */}
            <Route path="/" element={<TamagotchiDashboard />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
