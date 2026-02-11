import React from 'react';
import BulletAnimation from './Components/BulletAnimation';
import FighterJetAnimation from './Components/FighterJetAnimation';
import BombAnimation from './Components/BombAnimation';
import './Styles/App.css';
import Tube from './Components/Tube';

function App() {
  return (
    <div className="app-container">
      {/* Background animations */}
      <BulletAnimation />
      <FighterJetAnimation />
      <BombAnimation />
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 
                w-[90%] bg-black/30 backdrop-blur-sm 
                py-12 rounded-xl z-20">

  <div className="flex justify-center items-end gap-14 overflow-x-auto">

    {/* Tubes here */}
    <Tube percentage={45} color="#ef4444" label="COMPS" />
    <Tube percentage={45} color="#ef4444" label="IT" />
    <Tube percentage={45} color="#ef4444" label="CSEDS" />
    <Tube percentage={45} color="#ef4444" label="AIDS" />
    <Tube percentage={45} color="#ef4444" label="AIML" />
    <Tube percentage={45} color="#ef4444" label="ICB" />
    <Tube percentage={45} color="#ef4444" label="EXTC" />
    <Tube percentage={45} color="#ef4444" label="MECH" />
    <Tube percentage={45} color="#ef4444" label="OTHER" />

  </div>
</div>


    </div>
  );
}

export default App;
