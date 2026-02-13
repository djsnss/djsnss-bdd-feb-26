import React, { useState, useEffect, useCallback } from "react";
import BulletAnimation from "./Components/BulletAnimation";
import FighterJetAnimation from "./Components/FighterJetAnimation";
import BombAnimation from "./Components/BombAnimation";
import "./Styles/App.css";
import Tube from "./Components/Tube";
import PipeSystem, { TUBE_WIDTH, GAP } from "./Components/Pipe";
import { showDonationNotification } from "./Components/DonationNotification";
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

const DEMO_DONATIONS = [
  { donor: "Aarav Sharma", department: "COMPS", bloodGroup: "O+" },
  { donor: "Priya Patel", department: "IT", bloodGroup: "A+" },
  { donor: "Rahul Verma", department: "AIDS", bloodGroup: "B+" },
  { donor: "Sneha Joshi", department: "EXTC", bloodGroup: "AB-" },
  { donor: "Vikram Singh", department: "MECH", bloodGroup: "O-" },
  { donor: "Ananya Rao", department: "CSEDS", bloodGroup: "A-" },
  { donor: "Karan Mehta", department: "AIML", bloodGroup: "B-" },
  { donor: "Divya Nair", department: "ICB", bloodGroup: "O+" },
  { donor: "Arjun Gupta", department: "COMPS", bloodGroup: "AB+" },
];

function App() {
  const [tubeCounts, setTubeCounts] = useState(
    DEPARTMENTS.reduce((acc, dept) => ({ ...acc, [dept]: 0 }), {}),
  );
  const [activePipe, setActivePipe] = useState(null);
  const [demoStarted, setDemoStarted] = useState(false);

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

  const startDemo = () => {
    if (demoStarted) return;
    setDemoStarted(true);
    DEMO_DONATIONS.forEach((d, i) => {
      setTimeout(() => {
        showDonationNotification(d.donor, d.department, d.bloodGroup);
      }, i * 100);
    });
  };

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

      {/* ───────── HEADER (Placed ABOVE Transparent Box) ───────── */}
      <HeadingBox/>
      {/* ─────────────────────────────────────────────────────────── */}

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

      {/* Demo Button */}
      <button
        onClick={startDemo}
        disabled={demoStarted}
        className="fixed bottom-4 left-4 z-50 px-5 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: demoStarted
            ? "rgba(107,114,128,0.7)"
            : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {demoStarted ? "⏳ Running..." : "🩸 Start Demo"}
      </button>
    </div>
  );
}

export default App;
