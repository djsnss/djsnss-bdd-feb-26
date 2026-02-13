import React, { useState, useEffect, useRef } from "react";

const API_BASE = "https://djsnss-bdd-feb-26.onrender.com/bdd-feb26";
const POLL_INTERVAL = 30000;

const DonationNotification = () => {
  const [donor, setDonor] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animClass, setAnimClass] = useState("");
  const prevFirstRef = useRef(null);

  const fetchDonors = async () => {
    try {
      const res = await fetch(`${API_BASE}/latest-donors`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      if (data.length > 0) {
        const latestName = data[0];

        if (latestName !== prevFirstRef.current) {
          prevFirstRef.current = latestName;

          if (isVisible) {
            setAnimClass("notif-exit-right");
            await new Promise((r) => setTimeout(r, 500));
          }

          setDonor(latestName);
          setIsVisible(true);
          setAnimClass("notif-enter-right");
        }
      }
    } catch (err) {
      console.error("Failed to fetch latest donors:", err);
    }
  };

  useEffect(() => {
    fetchDonors();
    const interval = setInterval(fetchDonors, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !donor) return null;

  const donorName = typeof donor === "object" ? donor.name : donor;
  const department = typeof donor === "object" ? donor.department : "IT";
  const bloodGroup = typeof donor === "object" ? donor.bloodGroup : "AB+";

  return (
    <div
      className={animClass}
      style={{
        position: "fixed",
        top: "28px",
        right: "24px",
        zIndex: 9999,
        width: "400px",
        height: "150px",
      }}
    >
      {/* Card */}
      <div
        style={{
          position: "relative",
          borderRadius: "18px",
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(250,252,255,0.96) 100%)",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)",
          overflow: "hidden",
        }}
      >

        {/* Smooth subtle accent line */}
        <div
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, #e8b4b8, #c0392b, #e8b4b8)",
            opacity: 0.6,
            animation: "smoothBreath 4s ease-in-out infinite",
          }}
        />

        {/* Content */}
        <div style={{ padding: "16px 20px 14px" }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: "-4px",
                    borderRadius: "14px",
                    border: "2px solid rgba(231,76,60,0.15)",
                    animation: "pulseRing 2s ease-out infinite",
                  }}
                />
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                    boxShadow:
                      "0 4px 12px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <span style={{ fontSize: "22px", filter: "brightness(1.2)" }}>
                    🩸
                  </span>
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#374151",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: 0,
                  }}
                >
                  Blood Donated
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    margin: "1px 0 0 0",
                    fontWeight: 500,
                  }}
                >
                  just now
                </p>
              </div>
            </div>

            {/* Live badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px 3px 7px",
                borderRadius: "20px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 6px rgba(34,197,94,0.5)",
                  animation: "livePulse 1.5s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#16a34a",
                  letterSpacing: "0.05em",
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* Donor name */}
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "26px",
              fontWeight: 900,
              background:
                "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.01em",
              textAlign: "center",
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
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                padding: "3px 14px",
                borderRadius: "8px",
                fontSize: "15px",
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
                padding: "3px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 800,
                color: "#fff",
                background:
                  "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
                letterSpacing: "0.02em",
              }}
            >
              {bloodGroup}
            </span>
          </div>

          {/* Footer message */}
          <div
            style={{
              padding: "8px 14px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(255,153,51,0.06) 0%, rgba(19,136,8,0.06) 100%)",
              border: "1px solid rgba(0,0,0,0.03)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 600,
                color: "#6b7280",
                letterSpacing: "0.01em",
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

        @keyframes nameShine {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: 0% 0; }
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

        .notif-enter-right {
          animation: slideDownIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .notif-exit-right {
          animation: slideUpOut 0.4s ease forwards;
        }

        @keyframes slideDownIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideUpOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.96);
          }
        }
      `}</style>
    </div>
  );
};

export default DonationNotification;
