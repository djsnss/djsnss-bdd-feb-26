import React, { useEffect, useState } from "react";

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
  const [activePath, setActivePath] = useState(null);

  useEffect(() => {
    if (!activeDepartment) return;

    const index = DEPARTMENTS.indexOf(activeDepartment);
    if (index === -1) return;

    setActivePath(index);

    const timer = setTimeout(() => {
      onAnimationComplete && onAnimationComplete();
      // Wait for drain animation to finish (Total 3s)
      setTimeout(() => setActivePath(null), 1200); 
    }, 1800); // Trigger at 60% of 3s (1.8s)

    return () => clearTimeout(timer);
  }, [activeDepartment, onAnimationComplete]);

  /* Layout Math */
  const totalWidth =
    DEPARTMENTS.length * TUBE_WIDTH +
    (DEPARTMENTS.length - 1) * GAP;

  const centerX = totalWidth / 2;
  const junctionY = 0;
  const endY = 120;

  return (
    <div className="flex flex-col items-center w-full mb-1 px-4">
      {/* Responsive SVG */}
      <div className="w-full">
        <svg
          viewBox={`0 0 ${totalWidth} ${endY}`}
          preserveAspectRatio="xMidYMin meet"
          className="w-full h-auto"
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

          {/* Junction */}
          <circle
            cx={centerX}
            cy={junctionY}
            r="7"
            fill="rgba(255,255,255,0.7)"
          />

          {/* Branches */}
          {DEPARTMENTS.map((dept, i) => {
            const slotCenter =
              i * TOTAL_WIDTH_PER_ITEM + TUBE_WIDTH / 2;

            const midY = junctionY + (endY - junctionY) * 0.4;

            let pathEndX = slotCenter;
            if (Math.abs(pathEndX - centerX) < 0.5) {
              pathEndX = centerX + 0.5; // Ensure non-zero width for filter BBox
            }

            const pathData = `
              M ${centerX} ${junctionY}
              C ${centerX} ${midY},
                ${pathEndX} ${midY},
                ${pathEndX} ${endY}
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
                  fill={
                    isActive
                      ? "#ef4444"
                      : "rgba(255,255,255,0.5)"
                  }
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Animation */}
      <style>{`
        .pipe-flow-active {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: flow 3s ease-in-out forwards;
        }

        @keyframes flow {
          0% { stroke-dashoffset: 1000; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1000; }
        }
      `}</style>
    </div>
  );
};

export default PipeSystem;
