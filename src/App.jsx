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
    DEPARTMENTS.reduce((acc, dept) => ({ ...acc, [dept]: 0 }), {})
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
      window.removeEventListener(
        "donation-dismissed",
        handleDonationDismissed
      );
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
    <div className="app-container relative w-full min-h-screen overflow-hidden flex flex-col items-center">
      {/* Background Animations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BulletAnimation />
        <FighterJetAnimation />
        <BombAnimation />
      </div>

      {/* Logo */}
      <div
        className="absolute top-4 left-4 z-50 rounded-full flex items-center justify-center pointer-events-auto"
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
      <div className="absolute left-[-70px] top-[220px] z-0 pointer-events-none opacity-80">
        <img
          src="/assets/flag_gpt.png"
          alt="flag"
          className="w-[338px] h-auto object-contain"
        />
      </div>

      {/* Scrollable Main Content Wrapper */}
      <div className="relative z-10 w-full flex-grow flex flex-col items-center overflow-auto pt-8 pb-12">
        {/* Header */}
        <div className="mb-0 w-full flex justify-center px-4 z-20 -mb-4">
          <HeadingBox text="BLOOD DONATION DRIVE 2026" />
        </div>

        {/* Glass Container - Shared Layout */}
        <div className="w-full flex justify-center px-4">
          <div
            className="
              relative
              rounded-3xl
              bg-black/25
              backdrop-blur-md
              border border-white/10
              shadow-[0_8px_40px_rgba(0,0,0,0.2),_inset_0_1px_0_rgba(255,255,255,0.08)]
              pt-0
              pb-6
              px-6
              overflow-x-auto
              max-w-full
            "
          >
            <div
              className="flex flex-col items-center"
              style={{
                width:
                  DEPARTMENTS.length * TUBE_WIDTH +
                  (DEPARTMENTS.length - 1) * GAP,
                minWidth:
                  DEPARTMENTS.length * TUBE_WIDTH +
                  (DEPARTMENTS.length - 1) * GAP,
              }}
            >
              {/* Pipes */}
              <PipeSystem
                activeDepartment={activePipe}
                onAnimationComplete={handleAnimationComplete}
              />

              {/* Tubes */}
              <div
                className="flex items-end mt-2 w-full justify-between"
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
      </div>

      {/* Donation Notifications */}
      <DonationNotification />
    </div>
  );
}

export default App;
