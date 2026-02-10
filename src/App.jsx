import React from 'react';
import BulletAnimation from './Components/BulletAnimation';
import FighterJetAnimation from './Components/FighterJetAnimation';
import BombAnimation from './Components/BombAnimation';
import './Styles/App.css';

function App() {
  return (
    <div className="app-container">
      {/* Background animations */}
      <BulletAnimation />
      <FighterJetAnimation />
      <BombAnimation />
    </div>
  );
}

export default App;
