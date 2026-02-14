import React, { useState, useEffect, useCallback } from "react";
import BulletAnimation from "./Components/BulletAnimation";
import FighterJetAnimation from "./Components/FighterJetAnimation";
import BombAnimation from "./Components/BombAnimation";
import "./Styles/App.css";
import Tube from "./Components/Tube";
import PipeSystem, { TUBE_WIDTH, GAP } from "./Components/Pipe";
import DonationNotification from "./Components/DonationNotification";
import HeadingBox from "./Components/HeadingBox";

const DEPARTMENTS = [
  "COMPS",
  "IT",
  "CSEDS",
  "AIDS",
  "AIML",
  "ICB",
  "EXTC",
  "MECH",
  "OTHER",
];

function App() {
  const [tubeCounts, setTubeCounts] = useState(
    DEPARTMENTS.reduce((acc, dept) => ({ ...acc, [dept]: 0 }), {}),
  );
  const [activePipe, setActivePipe] = useState(null);

  useEffect(() => {
    const handleDonationDismissed = (event) => {
      const { department } = event.detail;
      if (DEPARTMENTS.includes(department)) {
        setActivePipe(department);
      }
    };

    window.addEventListener("donation-dismissed", handleDonationDismissed);
    return () =>
      window.removeEventListener("donation-dismissed", handleDonationDismissed);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    if (activePipe) {
      setTubeCounts((prev) => ({
        ...prev,
        [activePipe]: prev[activePipe] + 1,
      }));
      setActivePipe(null);
    }
  }, [activePipe]);

  return (
    <div className="app-container relative w-full h-screen overflow-hidden">
      {/* Background animations */}
      <BulletAnimation />
      <FighterJetAnimation />
      <BombAnimation />

      {/* Logo */}
      <div
        className="absolute top-4 left-4 z-50 rounded-full flex items-center justify-center"
        style={{
          width: 75,
          height: 75,
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 3px 16px rgba(0,0,0,0.25)",
          border: "2px solid rgba(255,255,255,0.7)",
        }}
      >
        <img
          src="/assets/DJSNSSLogo.png"
          alt="DJS NSS Logo"
          className="w-14 h-14 object-contain rounded-full"
        />
      </div>
      
{/* Indian Flag */}
<div
  className="
    absolute
    left-[-70px]     
    top-[220px]      
    z-50             
    pointer-events-none
  "
>
  <img
    src="/assets/flag_gpt.png"
    alt="flag"
    className="w-[338px] h-auto object-contain"
  />
</div>


      {/* ───────── HEADER ───────── */}
<HeadingBox text="BLOOD DONATION DRIVE 2026" />

      {/* Transparent Glass Container */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div
          className="rounded-3xl overflow-x-auto"
          style={{
            background: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
            padding: "28px 48px 32px",
            marginTop: "90px",
          }}
        >
          <div className="flex flex-col items-center min-w-max">
            <PipeSystem
              activeDepartment={activePipe}
              onAnimationComplete={handleAnimationComplete}
            />

            <div
              className="flex items-end mt-[-8px]"
              style={{
                width:
                  DEPARTMENTS.length * TUBE_WIDTH +
                  (DEPARTMENTS.length - 1) * GAP,
                justifyContent: "space-between",
              }}
            >
              {DEPARTMENTS.map((dept) => (
                <Tube
                  key={dept}
                  count={tubeCounts[dept]}
                  color="red"
                  label={dept}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right-side Donation Notifications */}
      <DonationNotification />
    </div>
  );
}

export default App;
