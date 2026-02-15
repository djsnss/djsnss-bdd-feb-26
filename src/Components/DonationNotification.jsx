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
        width: "min(18vw, 320px)",
        maxWidth: "85vw",
      }}
    >
      {/* Card */}
      <div
        style={{
          position: "relative",
          borderRadius: "min(0.8vw, 14px)",
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(250,252,255,0.96) 100%)",
          boxShadow:
            "0 1vh 2.5vw rgba(0,0,0,0.2), 0 0.3vh 0.8vw rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)",
          overflow: "hidden",
        }}
      >
        {/* Smooth subtle accent line */}
        <div
          style={{
            height: "0.3vh",
            background:
              "linear-gradient(90deg, #e8b4b8, #c0392b, #e8b4b8)",
            opacity: 0.6,
            animation: "smoothBreath 4s ease-in-out infinite",
          }}
        />

        {/* Content */}
        <div style={{ padding: "1.2vh 1.1vw 1.4vh" }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.6vh",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.4vw" }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: "-0.2vw",
                    borderRadius: "0.6vw",
                    border: "2px solid rgba(231,76,60,0.15)",
                    animation: "pulseRing 2s ease-out infinite",
                  }}
                />
                <div
                  style={{
                    width: "min(2.2vw, 34px)",
                    height: "min(2.2vw, 34px)",
                    borderRadius: "0.6vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                    boxShadow:
                      "0 0.2vh 0.5vw rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <span style={{ fontSize: "min(1.2vw, 18px)", filter: "brightness(1.2)" }}>
                    🩸
                  </span>
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "min(0.6vw, 11px)",
                    fontWeight: 800,
                    color: "#374151",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: 0,
                  }}
                >
                  Blood Donated
                </p>
              </div>
            </div>

            {/* Live badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3vw",
                padding: "0.15vh 0.4vw 0.15vh 0.3vw",
                borderRadius: "1.2vw",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
            >
              <div
                style={{
                  width: "min(0.35vw, 5px)",
                  height: "min(0.35vw, 5px)",
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 0.4vw rgba(34,197,94,0.5)",
                  animation: "livePulse 1.5s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "min(0.5vw, 8px)",
                  fontWeight: 800,
                  color: "#16a34a",
                  letterSpacing: "0.05em",
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
              margin: "0 0 0.3vh 0",
            }}
          />

          {/* Donor name */}
          <p
            style={{
              margin: "0 0 0.7vh 0",
              fontSize: "min(1.6vw, 22px)",
              fontWeight: 900,
              background:
                "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.01em",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {donorName}
          </p>

          {/* Dept + Blood group row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4vw",
              marginBottom: "0.5vh",
            }}
          >
            <span
              style={{
                padding: "0.2vh 0.9vw",
                borderRadius: "0.5vw",
                fontSize: "min(0.65vw, 12px)",
                fontWeight: 700,
                color: "#374151",
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {department}
            </span>
            <span
              style={{
                padding: "0.2vh 0.8vw",
                borderRadius: "0.5vw",
                fontSize: "min(0.65vw, 11px)",
                fontWeight: 800,
                color: "#fff",
                background:
                  "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                boxShadow: "0 0.15vh 0.5vw rgba(239,68,68,0.3)",
                letterSpacing: "0.02em",
              }}
            >
              {bloodGroup}
            </span>
          </div>

          {/* Footer message */}
          <div
            style={{
              marginTop: "0.6vh",
              padding: "0.35vh 0.5vw",
              borderRadius: "min(0.4vw, 6px)",
              background:
                "linear-gradient(135deg, rgba(255,153,51,0.06) 0%, rgba(255,255,255,0.04) 50%, rgba(19,136,8,0.06) 100%)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "min(0.6vw, 9px)",
                fontWeight: 600,
                color: "#7c8591",
                letterSpacing: "0.02em",
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
      `}</style>
    </div>
  );
};

export default DonationNotification;

