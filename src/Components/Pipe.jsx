import React, { useEffect, useState, useRef } from "react";
import { DonationToast } from "./DonationNotification";

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

export const TUBE_WIDTH = 55;
export const GAP = 56;

const TOTAL_WIDTH_PER_ITEM = TUBE_WIDTH + GAP;
const FLOW_DURATION = 2;

const PipeSystem = ({ activeDepartment, onAnimationComplete }) => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [animState, setAnimState] = useState("idle");
  const [notifKey, setNotifKey] = useState(0);

  const pendingNotifRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  /* ───────────── Notification Event Handling ───────────── */

  useEffect(() => {
    const handleShow = (event) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (animState === "visible" || animState === "entering") {
        pendingNotifRef.current = event.detail;
        setAnimState("exiting");
      } else {
        setCurrentNotification(event.detail);
        setNotifKey((k) => k + 1);
        setAnimState("entering");
      }
    };

    const handleHide = () => setAnimState("exiting");

    window.addEventListener("donation-show", handleShow);
    window.addEventListener("donation-hide", handleHide);

    return () => {
      window.removeEventListener("donation-show", handleShow);
      window.removeEventListener("donation-hide", handleHide);
    };
  }, [animState]);

  /* ───────────── Animation State Machine ───────────── */

  useEffect(() => {
    if (animState === "entering") {
      const t = setTimeout(() => setAnimState("visible"), 600);
      return () => clearTimeout(t);
    }

    if (animState === "exiting") {
      const t = setTimeout(() => {
        if (pendingNotifRef.current) {
          setCurrentNotification(pendingNotifRef.current);
          pendingNotifRef.current = null;
          setNotifKey((k) => k + 1);
          setAnimState("entering");
        } else {
          setCurrentNotification(null);
          setAnimState("idle");
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [animState]);

  /* ───────────── Pipe Activation ───────────── */

  useEffect(() => {
    if (!activeDepartment) return;

    const index = DEPARTMENTS.indexOf(activeDepartment);
    if (index === -1) return;

    setActivePath(index);

    const timer = setTimeout(() => {
      onAnimationComplete && onAnimationComplete();
      setTimeout(() => setActivePath(null), 600);
    }, FLOW_DURATION * 1000);

    return () => clearTimeout(timer);
  }, [activeDepartment, onAnimationComplete]);

  /* ───────────── Layout Calculations ───────────── */

  const totalWidth =
    DEPARTMENTS.length * TUBE_WIDTH +
    (DEPARTMENTS.length - 1) * GAP;

  const centerX = totalWidth / 2;
  const junctionY = 18;   // compact
  const endY = 95;        // reduced height

  const getNotifClass = () => {
    if (animState === "entering") return "notif-enter";
    if (animState === "exiting") return "notif-exit";
    if (animState === "visible") return "notif-visible";
    return "";
  };

  return (
    <div className="flex flex-col items-center w-full mb-1">

      {/* ───────── Notification Area ───────── */}
      <div className="relative z-50 mb-1" style={{ minHeight: 75 }}>
        {currentNotification && (
          <div
            key={notifKey}
            className={`notif-card ${getNotifClass()}`}
            style={{ width: 440 }}
          >
            <DonationToast
              donor={currentNotification.donor}
              department={currentNotification.department}
              bloodGroup={currentNotification.bloodGroup}
              visible={animState !== "exiting"}
            />
          </div>
        )}
      </div>

      {/* ───────── Pipe SVG System ───────── */}
      <div className="relative" style={{ width: totalWidth, height: endY }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${totalWidth} ${endY}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="pipeStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
            </linearGradient>

            <linearGradient id="bloodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            <filter id="bloodGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main Vertical Stem */}
          <line
            x1={centerX}
            y1={0}
            x2={centerX}
            y2={junctionY}
            stroke="url(#pipeStroke)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Junction */}
          <circle
            cx={centerX}
            cy={junctionY}
            r="7"
            fill="rgba(255,255,255,0.7)"
          />

          {/* Branches */}
          {DEPARTMENTS.map((dept, i) => {
            const slotCenter = i * TOTAL_WIDTH_PER_ITEM + TUBE_WIDTH / 2;
            const midY = junctionY + (endY - junctionY) * 0.4;
            const pathData = `
              M ${centerX} ${junctionY}
              C ${centerX} ${midY},
                ${slotCenter} ${midY},
                ${slotCenter} ${endY}
            `;
            const isActive = activePath === i;

            return (
              <g key={dept}>
                <path
                  d={pathData}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                />

                {isActive && (
                  <path
                    d={pathData}
                    stroke="url(#bloodGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#bloodGlow)"
                    className="pipe-flow-active"
                  />
                )}

                <circle
                  cx={slotCenter}
                  cy={endY}
                  r="4"
                  fill={isActive ? "#ef4444" : "rgba(255,255,255,0.5)"}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ───────── Animations ───────── */}
      <style>{`
        .notif-enter {
          animation: notifIn 0.6s ease forwards;
        }

        .notif-exit {
          animation: notifOut 0.5s ease forwards;
        }

        @keyframes notifIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes notifOut {
          from { opacity: 1; }
          to { opacity: 0; transform: translateY(-20px) scale(0.9); }
        }

        .pipe-flow-active {
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
          animation: flow ${FLOW_DURATION}s ease forwards;
        }

        @keyframes flow {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default PipeSystem;
