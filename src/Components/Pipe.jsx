import React, { useEffect, useState, useRef } from "react";
import { DonationToast } from "./DonationNotification";

const DEPARTMENTS = [
  "COMPS", "IT", "CSEDS", "AIDS", "AIML", "ICB", "EXTC", "MECH", "OTHER"
];

export const TUBE_WIDTH = 55;
export const GAP = 56;
const TOTAL_WIDTH_PER_ITEM = TUBE_WIDTH + GAP;
const FLOW_DURATION = 2;

const PipeSystem = ({ activeDepartment, onAnimationComplete }) => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [animState, setAnimState] = useState('idle'); // 'idle' | 'entering' | 'visible' | 'exiting'
  const [queueActive, setQueueActive] = useState(false);
  const [notifKey, setNotifKey] = useState(0); // unique key for re-triggering animation
  const hideTimeoutRef = useRef(null);
  const pendingNotifRef = useRef(null);

  useEffect(() => {
    const handleShow = (event) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setQueueActive(true);

      // If something is currently showing, first exit it, then enter the new one
      if (animState === 'visible' || animState === 'entering') {
        pendingNotifRef.current = event.detail;
        setAnimState('exiting');
      } else {
        // Nothing showing — enter directly
        setCurrentNotification(event.detail);
        setNotifKey(k => k + 1);
        setAnimState('entering');
      }
    };

    const handleHide = () => {
      setAnimState('exiting');
    };

    const handleQueueEmpty = () => {
      setQueueActive(false);
    };

    window.addEventListener('donation-show', handleShow);
    window.addEventListener('donation-hide', handleHide);
    window.addEventListener('donation-queue-empty', handleQueueEmpty);

    return () => {
      window.removeEventListener('donation-show', handleShow);
      window.removeEventListener('donation-hide', handleHide);
      window.removeEventListener('donation-queue-empty', handleQueueEmpty);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [animState]);

  // Handle animation state transitions
  useEffect(() => {
    if (animState === 'entering') {
      // After enter animation completes → visible
      const t = setTimeout(() => setAnimState('visible'), 600);
      return () => clearTimeout(t);
    }
    if (animState === 'exiting') {
      // After exit animation completes → check for pending
      const t = setTimeout(() => {
        if (pendingNotifRef.current) {
          // Swap to the next notification
          setCurrentNotification(pendingNotifRef.current);
          pendingNotifRef.current = null;
          setNotifKey(k => k + 1);
          setAnimState('entering');
        } else {
          // Nothing pending — go idle
          setCurrentNotification(null);
          setAnimState('idle');
        }
      }, 500); // exit animation duration
      return () => clearTimeout(t);
    }
  }, [animState]);

  useEffect(() => {
    if (activeDepartment) {
      const index = DEPARTMENTS.indexOf(activeDepartment);
      if (index !== -1) {
        setActivePath(index);
        const timer = setTimeout(() => {
          onAnimationComplete && onAnimationComplete();
          setTimeout(() => setActivePath(null), 600);
        }, FLOW_DURATION * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeDepartment, onAnimationComplete]);

  const totalWidth = DEPARTMENTS.length * TUBE_WIDTH + (DEPARTMENTS.length - 1) * GAP;
  const centerX = totalWidth / 2;
  const junctionY = 20;
  const endY = 120;

  const showDefaultHeader = !currentNotification && animState === 'idle' && !queueActive;

  // Determine animation class for the notification
  const getNotifAnimClass = () => {
    if (animState === 'entering') return 'notif-enter';
    if (animState === 'exiting') return 'notif-exit';
    if (animState === 'visible') return 'notif-visible';
    return '';
  };

  return (
    <div className="flex flex-col items-center w-full mb-1">

      {/* Header / Notification Area */}
      <div className="relative z-50 mb-1" style={{ minHeight: 180 }}>
        <div className="flex items-end justify-center h-full"
          style={{ perspective: '800px' }}>

          {/* Notification Card with fade animation */}
          {currentNotification && (
            <div
              key={notifKey}
              className={`notif-card ${getNotifAnimClass()}`}
              style={{ width: 460 }}
            >
              <DonationToast
                donor={currentNotification.donor}
                department={currentNotification.department}
                bloodGroup={currentNotification.bloodGroup}
                visible={animState !== 'exiting'}
              />
            </div>
          )}

          {/* Default Header */}
          <div className={`header-card ${showDefaultHeader ? 'header-enter' : 'header-exit'}`}>
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-25"
                style={{ background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)' }}
              />
              <div className="relative bg-white/85 backdrop-blur-lg px-10 py-4 rounded-full shadow-xl border border-white/40 mb-4">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 via-red-500 to-red-800 bg-clip-text text-transparent uppercase tracking-wider">
                  Blood Donation Drive
                </h2>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Pipe SVG System */}
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

            <filter id="pipeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.2)" />
            </filter>
          </defs>

          {/* Main stem */}
          <line
            x1={centerX} y1={0} x2={centerX} y2={junctionY}
            stroke="url(#pipeStroke)"
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#pipeShadow)"
          />

          {/* Junction */}
          <circle cx={centerX} cy={junctionY} r="10" fill="rgba(255,255,255,0.15)" />
          <circle cx={centerX} cy={junctionY} r="5" fill="rgba(255,255,255,0.7)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

          {/* Branches */}
          {DEPARTMENTS.map((dept, i) => {
            const slotCenter = i * TOTAL_WIDTH_PER_ITEM + TUBE_WIDTH / 2;
            const midY = junctionY + (endY - junctionY) * 0.4;
            const pathData = `
              M ${centerX} ${junctionY}
              C ${centerX} ${midY}, ${slotCenter} ${midY}, ${slotCenter} ${endY}
            `;
            const isActive = activePath === i;

            return (
              <g key={dept}>
                <path d={pathData} stroke="rgba(255,255,255,0.25)" strokeWidth="12" fill="none" strokeLinecap="round" />
                <path d={pathData} stroke="url(#pipeStroke)" strokeWidth="6" fill="none" strokeLinecap="round" filter="url(#pipeShadow)" />
                <path d={pathData} stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" />

                {isActive && (
                  <path d={pathData} stroke="url(#bloodGradient)" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#bloodGlow)" className="pipe-flow-active" />
                )}

                <circle cx={slotCenter} cy={endY} r="5"
                  fill={isActive ? "#ef4444" : "rgba(255,255,255,0.5)"}
                  stroke={isActive ? "#dc2626" : "rgba(255,255,255,0.3)"}
                  strokeWidth="1.5"
                  className="transition-all duration-500"
                />
              </g>
            );
          })}

          {activePath !== null && (() => {
            const slotCenter = activePath * TOTAL_WIDTH_PER_ITEM + TUBE_WIDTH / 2;
            return (
              <g>
                {[0, 1, 2].map((di) => (
                  <circle key={di} cx={slotCenter} cy={endY} r="3" fill="#ef4444"
                    className="blood-drip"
                    style={{ animationDelay: `${FLOW_DURATION + di * 0.2}s` }}
                  />
                ))}
              </g>
            );
          })()}
        </svg>
      </div>

      {/* ── All Animations ── */}
      <style>{`
        /* ── Notification Enter/Exit ── */
        .notif-card {
          position: relative;
          will-change: transform, opacity;
        }

        .notif-enter {
          animation: notifSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .notif-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .notif-exit {
          animation: notifSlideOut 0.5s cubic-bezier(0.55, 0, 1, 0.45) forwards;
        }

        @keyframes notifSlideIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.92);
            filter: blur(4px);
          }
          40% {
            opacity: 0.7;
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes notifSlideOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          60% {
            opacity: 0.4;
            filter: blur(2px);
          }
          100% {
            opacity: 0;
            transform: translateY(-25px) scale(0.92);
            filter: blur(6px);
          }
        }

        /* ── Header Enter/Exit ── */
        .header-card {
          will-change: transform, opacity;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .header-enter {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .header-exit {
          opacity: 0;
          transform: translateY(15px) scale(0.9);
          position: absolute;
          pointer-events: none;
        }

        /* ── Pipe Flow ── */
        .pipe-flow-active {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: pipeFlow ${FLOW_DURATION}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes pipeFlow {
          0%   { stroke-dashoffset: 600; opacity: 0.5; }
          10%  { opacity: 1; }
          100% { stroke-dashoffset: 0;   opacity: 1; }
        }

        /* ── Blood Drips ── */
        .blood-drip {
          animation: dripFall 0.7s ease-in forwards;
          opacity: 0;
        }

        @keyframes dripFall {
          0%   { transform: translateY(0);    opacity: 0.9; }
          100% { transform: translateY(25px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PipeSystem;
