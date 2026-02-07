import React from 'react';
import ShootingStars from './Components/ShootingStars';
import { BloodDonationLeaderboard } from './Components/BloodDonationLeaderboard';
import DonationToaster, { showDonationNotification } from './Components/DonationNotification';
import './Styles/App.css';

// Test function - remove after testing
const testNotification = () => {
  const departments = ['COMPS', 'IT', 'EXTC', 'AIDS', 'AIML', 'MECH', 'ICB', 'CSEDS'];
  const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Desai', 'Rohan Mehta', 'Neha Singh'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  
  const randomDept = departments[Math.floor(Math.random() * departments.length)];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomBloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
  
  showDonationNotification(randomName, randomDept, randomBloodGroup);
};

function App() {
  return (
    <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
      <DonationToaster />
      <ShootingStars starCount={30} />
      <div className="leaderboard-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        <BloodDonationLeaderboard />
      </div>
      {/* Test button - remove after testing */}
      <button
        onClick={testNotification}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)',
          zIndex: 9999,
        }}
      >
        🩸 Test Notification
      </button>
    </div>
  );
}

export default App;

