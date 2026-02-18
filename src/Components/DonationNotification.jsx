import React, { useState, useEffect, useRef } from "react";
import { IN } from 'country-flag-icons/react/3x2';

const API_BASE = "https://djsnss-bdd-feb-26.onrender.com/bdd-feb26";
const POLL_INTERVAL = 80000; // 1 min 20 sec
const DISPLAY_DURATION = 10000; // 10 seconds per donor

const DonationNotification = () => {
  const [currentDonor, setCurrentDonor] = useState(null);
  const [fadeState, setFadeState] = useState("hidden");
  const queueRef = useRef([]);
  const seenRef = useRef(new Set());
  const processingRef = useRef(false);

  // Process queue: show next donor
  useEffect(() => {
    // Start processing cycle when we get a donor to show
    if (!processingRef.current && queueRef.current.length > 0 && !currentDonor) {
      const next = queueRef.current.shift();
      processingRef.current = true;
      setCurrentDonor(next);
      setFadeState("fade-in");

      // Dispatch event for pipe animation
      const dept = typeof next === "object" ? next.department : "IT";
      window.dispatchEvent(
        new CustomEvent("donation-dismissed", { detail: { department: dept } })
      );
    }
  });

  // Handle display timing: fade-in -> visible -> fade-out -> next
  useEffect(() => {
    if (fadeState === "fade-in") {
      const t = setTimeout(() => setFadeState("visible"), 500);
      return () => clearTimeout(t);
    }

    if (fadeState === "visible") {
      const t = setTimeout(() => setFadeState("fade-out"), DISPLAY_DURATION);
      return () => clearTimeout(t);
    }

    if (fadeState === "fade-out") {
      const t = setTimeout(() => {
        // Check queue for next donor
        if (queueRef.current.length > 0) {
          const next = queueRef.current.shift();
          setCurrentDonor(next);
          setFadeState("fade-in");

          // Dispatch event for pipe animation
          const dept = typeof next === "object" ? next.department : "IT";
          window.dispatchEvent(
            new CustomEvent("donation-dismissed", {
              detail: { department: dept },
            })
          );
        } else {
          // Queue empty, hide notification
          setCurrentDonor(null);
          setFadeState("hidden");
          processingRef.current = false;
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [fadeState]);

  // Poll API every 80 seconds
  useEffect(() => {
    const addToQueue = (donors) => {
      const newDonors = donors.filter((d) => {
        const key =
          typeof d === "object"
            ? `${d.name}_${d.bloodGroup}_${d.department}`
            : d;
        if (seenRef.current.has(key)) return false;
        seenRef.current.add(key);
        return true;
      });

      if (newDonors.length > 0) {
        queueRef.current.push(...newDonors);

        // If nothing showing, kick off display
        if (!processingRef.current) {
          const first = queueRef.current.shift();
          processingRef.current = true;
          setCurrentDonor(first);
          setFadeState("fade-in");

          const dept =
            typeof first === "object" ? first.department : "IT";
          window.dispatchEvent(
            new CustomEvent("donation-dismissed", {
              detail: { department: dept },
            })
          );
        }
      }
    };

    const fetchDonors = async () => {
      try {
        const res = await fetch(`${API_BASE}/latest-donors`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        if (data.length > 0) {
          addToQueue(data);
        }
      } catch (err) {
        console.error("Failed to fetch latest donors:", err);
      }
    };

    fetchDonors();
    const interval = setInterval(fetchDonors, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (fadeState === "hidden" || !currentDonor) return null;

  const donorName =
    typeof currentDonor === "object" ? currentDonor.name : currentDonor;
  const department =
    typeof currentDonor === "object" ? currentDonor.department : "—";
  const bloodGroup =
    typeof currentDonor === "object" ? currentDonor.bloodGroup : "—";

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
        width: "clamp(280px, 24vw, 420px)",
      }}
    >
      {/* Card — Military dispatch style */}
      <div
        style={{
          position: "relative",
          borderRadius: "0.6vw",
          background:
            "linear-gradient(170deg, rgba(35,28,20,0.82) 0%, rgba(45,35,26,0.85) 40%, rgba(30,25,18,0.88) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow:
            "0 10px 35px rgba(0,0,0,0.35), 0 2px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(243,173,92,0.15)",
          overflow: "hidden",
          border: "1.5px solid rgba(243,173,92,0.35)",
        }}
      >
        {/* Top tri-color flag with Ashoka Chakra */}
        <div style={{ display: "flex", height: "1.8vw", position: "relative" }}>
          <div style={{ flex: 1, background: "linear-gradient(180deg, #FF9933, #e68a2e)" }} />
          <div style={{ flex: 1, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Ashoka Chakra — proper SVG */}
            <svg
              viewBox="0 0 100 100"
              style={{
                width: "1.4vw",
                height: "1.4vw",
                animation: "chakraSpin 20s linear infinite",
              }}
            >
              {/* Outer rim */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="#000080" strokeWidth="4" />
              {/* 24 spokes */}
              {Array.from({ length: 24 }, (_, i) => {
                const angle = (i * 360) / 24;
                const rad = (angle * Math.PI) / 180;
                const x2 = 50 + 44 * Math.cos(rad);
                const y2 = 50 + 44 * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={x2}
                    y2={y2}
                    stroke="#000080"
                    strokeWidth="1.8"
                  />
                );
              })}
              {/* Center hub */}
              <circle cx="50" cy="50" r="8" fill="#000080" />
              <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
            </svg>
          </div>
          <div style={{ flex: 1, background: "linear-gradient(180deg, #138808, #0f6b06)" }} />
        </div>

        {/* Military header bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #2c3e1a 0%, #3d5a1e 50%, #2c3e1a 100%)",
            padding: "0.35vw 0.8vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.3vw" }}>
            <span style={{ fontSize: "0.65vw", color: "#d4c896" }}>★ ★ ★</span>
            <span
              style={{
                fontSize: "0.6vw",
                fontWeight: 900,
                color: "#d4c896",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "'Courier New', monospace",
              }}
            >
              OPERATION RAKT SE RAKSHA
            </span>
          </div>
          {/* Live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25vw",
              padding: "0.1vw 0.45vw",
              borderRadius: "2px",
              background: "rgba(255,60,60,0.15)",
              border: "1px solid rgba(255,80,80,0.3)",
            }}
          >
            <div
              style={{
                width: "0.35vw",
                height: "0.35vw",
                borderRadius: "50%",
                background: "#ff4444",
                boxShadow: "0 0 6px rgba(255,68,68,0.7)",
                animation: "livePulse 1.5s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: "0.5vw",
                fontWeight: 900,
                color: "#ff6666",
                letterSpacing: "0.1em",
                fontFamily: "'Courier New', monospace",
              }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* Content area */}
        <div style={{ padding: "0.9vw 1vw 0.7vw" }}>
          {/* Blood group shield + Donor name row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6vw",
              marginBottom: "0.6vw",
            }}
          >
            {/* Blood Group Shield */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  position: "absolute",
                  inset: "-0.25vw",
                  borderRadius: "0.4vw",
                  border: "2px solid rgba(26,35,126,0.2)",
                  animation: "pulseRing 2s ease-out infinite",
                }}
              />
              <div
                style={{
                  width: "3vw",
                  height: "3vw",
                  borderRadius: "0.4vw",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #1a237e 100%)",
                  boxShadow: "0 4px 12px rgba(26,35,126,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                  border: "1.5px solid #d4c896",
                }}
              >
                <span
                  style={{
                    fontSize: "1vw",
                    fontWeight: 900,
                    color: "#d4c896",
                    letterSpacing: "0.04em",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {bloodGroup}
                </span>
              </div>
            </div>

            {/* Donor Name — stencil style, no wrap */}
            <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
              <p
                style={{
                  fontSize: "1.4vw",
                  fontWeight: 900,
                  color: "#f3ad5c",
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "'Courier New', monospace",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {donorName}
              </p>
              <p
                style={{
                  fontSize: "0.55vw",
                  fontWeight: 700,
                  color: "#b8a67e",
                  margin: "0.15vw 0 0 0",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                ▸ DONOR CONFIRMED
              </p>
            </div>
          </div>

          {/* Department — military unit style */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4vw",
              marginBottom: "0.5vw",
              padding: "0.25vw 0",
              borderTop: "1px dashed rgba(243,173,92,0.3)",
              borderBottom: "1px dashed rgba(243,173,92,0.3)",
            }}
          >
            <span style={{ fontSize: "0.6vw", color: "#8fbc6a" }}>◆</span>
            <span
              style={{
                fontSize: "0.7vw",
                fontWeight: 800,
                color: "#a8d87e",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "'Courier New', monospace",
              }}
            >
              UNIT: {department}
            </span>
            <span style={{ fontSize: "0.6vw", color: "#6b8e23" }}>◆</span>
          </div>

          {/* Footer — patriotic message */}
          <div
            style={{
              padding: "0.3vw 0.6vw",
              borderRadius: "0.3vw",
              background:
                "linear-gradient(135deg, rgba(255,153,51,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(19,136,8,0.12) 100%)",
              border: "1px solid rgba(243,173,92,0.2)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.65vw",
                fontWeight: 700,
                color: "#c4b08a",
                letterSpacing: "0.1em",
                fontFamily: "'Courier New', monospace",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5vw",
                whiteSpace: "nowrap",
              }}
            >
              <span>🎖️ SERVING THE NATION WITH EVERY DROP</span>
              <IN title="India" style={{ width: '1.2vw', height: '0.8vw', borderRadius: '2px', border: '0.5px solid rgba(255,255,255,0.2)' }} />
            </p>
          </div>
        </div>

        {/* Bottom tri-color accent */}
        <div style={{ display: "flex", height: "0.25vw" }}>
          <div style={{ flex: 1, background: "#FF9933" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#138808" }} />
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1.25); opacity: 0; }
        }

        @keyframes chakraSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }



        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
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
            transform: translateX(2vw) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes notifFadeOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(2vw) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default DonationNotification;
