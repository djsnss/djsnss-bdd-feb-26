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
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    if (!activeDepartment) return;

    const { dept, isRandom, id } = activeDepartment;
    const index = DEPARTMENTS.indexOf(dept);
    if (index === -1) return;

    // Add new animation
    const newAnim = { id, index, isRandom };
    setAnimations((prev) => [...prev, newAnim]);

    // Schedule "hit" callback (1.8s)
    const hitTimer = setTimeout(() => {
      onAnimationComplete && onAnimationComplete(activeDepartment);
    }, 1800);

    // Schedule cleanup (3s)
    const cleanupTimer = setTimeout(() => {
      setAnimations((prev) => prev.filter((a) => a.id !== id));
    }, 3000);

    return () => {
      // We generally don't want to cancel ongoing animations if the prop changes
      // So we might not need cleanup here unless component unmounts.
      // However, to be safe, we can leave the timers running as they are self-containing.
      // But if we wanted to be strictly clean on unmount:
      // clearTimeout(hitTimer);
      // clearTimeout(cleanupTimer);
    };
  }, [activeDepartment, onAnimationComplete]);

  /* Layout Math */
  const totalWidth =
    DEPARTMENTS.length * TUBE_WIDTH +
    (DEPARTMENTS.length - 1) * GAP;

  const centerX = totalWidth / 2;
  const junctionY = 0;
  const endY = 120;

  return (
    <div className="flex flex-col items-center w-full px-4">
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

            // Check if this pipe has any active animations
            const activeAnims = animations.filter(a => a.index === i);

            return (
              <g key={dept}>
                <path
                  d={pathData}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                />

                {activeAnims.map(anim => (
                   <path
                   key={anim.id}
                   d={pathData}
                   stroke="url(#bloodGradient)"
                   strokeWidth="6"
                   fill="none"
                   strokeLinecap="round"
                   filter="url(#bloodGlow)"
                   className="pipe-flow-active"
                 />
                ))}

                <circle
                  cx={slotCenter}
                  cy={endY}
                  r="4"
                  fill={
                    activeAnims.length > 0
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
