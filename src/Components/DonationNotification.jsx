import React, { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://djsnss-bdd-feb-26.onrender.com/bdd-feb26";
const POLL_INTERVAL = 30000;
const DISPLAY_DURATION = 15000; // 15 seconds visibility

const DonationNotification = () => {
  const [donor, setDonor] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fadeState, setFadeState] = useState("hidden"); // "hidden" | "fade-in" | "visible" | "fade-out"
  const prevFirstRef = useRef(null);
  const hideTimerRef = useRef(null);

  // Clear any existing hide timer
  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  // Start the 15-second auto-hide timer
  const startHideTimer = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setFadeState("fade-out");
      // After fade-out animation completes, hide the component
      setTimeout(() => {
        setIsVisible(false);
        setFadeState("hidden");
      }, 500);
    }, DISPLAY_DURATION);
  }, [clearHideTimer]);

  // Show notification with fade-in
  const showNotification = useCallback((newDonor) => {
    setDonor(newDonor);
    setIsVisible(true);
    setFadeState("fade-in");
    // After fade-in completes, mark as visible
    setTimeout(() => setFadeState("visible"), 500);
    startHideTimer();
  }, [startHideTimer]);

  const fetchDonors = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/latest-donors`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      if (data.length > 0) {
        const latestName = data[0];

        if (latestName !== prevFirstRef.current) {
          prevFirstRef.current = latestName;

          // If already visible, fade out first then show new one
          if (isVisible && (fadeState === "visible" || fadeState === "fade-in")) {
            clearHideTimer();
            setFadeState("fade-out");
            await new Promise((r) => setTimeout(r, 500));
            showNotification(latestName);
          } else {
            showNotification(latestName);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch latest donors:", err);
    }
  }, [isVisible, fadeState, clearHideTimer, showNotification]);

  useEffect(() => {
    fetchDonors();
    const interval = setInterval(fetchDonors, POLL_INTERVAL);
    return () => {
      clearInterval(interval);
      clearHideTimer();
    };
  }, []);

  if (!isVisible || !donor) return null;

  const donorName = typeof donor === "object" ? donor.name : donor;
  const department = typeof donor === "object" ? donor.department : "IT";
  const bloodGroup = typeof donor === "object" ? donor.bloodGroup : "AB+";

  // Determine animation class based on fade state
  const animClass =
    fadeState === "fade-in"
      ? "notif-fade-in"
      : fadeState === "fade-out"
        ? "notif-fade-out"
        : "";

  return (
    <div
      className={animClass}
      style={{
        position: "fixed",
        top: "1.5vh",
        right: "1vw",
        zIndex: 9999,
        width: "clamp(200px, 18vw, 320px)",
      }}
    >
      {/* Card */}
      <div
        style={{
          position: "relative",
          borderRadius: "12px",
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(250,252,255,0.96) 100%)",
          boxShadow:
            "0 8px 28px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
          overflow: "hidden",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            height: "2.5px",
            background: "linear-gradient(90deg, #e8b4b8, #c0392b, #e8b4b8)",
            opacity: 0.6,
            animation: "smoothBreath 4s ease-in-out infinite",
          }}
        />

        {/* Content */}
        <div style={{ padding: "10px 14px 10px" }}>
          {/* Row: Blood group + Name + LIVE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Blood Group Circle */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: "-3px",
                    borderRadius: "50%",
                    border: "2px solid rgba(231,76,60,0.15)",
                    animation: "pulseRing 2s ease-out infinite",
                  }}
                />
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                    boxShadow: "0 3px 8px rgba(239,68,68,0.35)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 900,
                      color: "#fff",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {bloodGroup}
                  </span>
                </div>
              </div>

              {/* Donor Name */}
              <p
                style={{
                  fontSize: "23px",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {donorName}
              </p>
            </div>

            {/* Live badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "2px 7px 2px 5px",
                borderRadius: "20px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.15)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 5px rgba(34,197,94,0.5)",
                  animation: "livePulse 1.5s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "8px",
                  fontWeight: 800,
                  color: "#16a34a",
                  letterSpacing: "0.05em",
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* Department */}
          <div style={{ textAlign: "center", marginBottom: "6px" }}>
            <span
              style={{
                display: "inline-block",
                padding: "2px 10px",
                borderRadius: "10px",
                fontSize: "10px",
                fontWeight: 600,
                color: "#6b7280",
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {department}
            </span>
          </div>

          {/* Thank you */}
          <div
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              background:
                "linear-gradient(135deg, rgba(255,153,51,0.06) 0%, rgba(255,255,255,0.04) 50%, rgba(19,136,8,0.06) 100%)",
              border: "1px solid rgba(0,0,0,0.03)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "9px",
                fontWeight: 600,
                color: "#9ca3af",
              }}
            >
              🎉 Thank you for donating blood! 💖
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes smoothBreath {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1.25); opacity: 0; }
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .notif-fade-in {
          animation: notifFadeIn 0.5s ease-out forwards;
        }

        .notif-fade-out {
          animation: notifFadeOut 0.5s ease-in forwards;
        }

        @keyframes notifFadeIn {
          from {
            opacity: 0;
            transform: translateY(-1.5vh) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes notifFadeOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-1.5vh) scale(0.96);
          }
        }
      `}</style >
    </div >
  );
};

export default DonationNotification;

