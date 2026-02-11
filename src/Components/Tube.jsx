import React from "react";

const Tube = ({ percentage = 40, color = "#dc2626", label = "COMPS" }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-[55px] h-[260px] border-[3px] border-[#272822] bg-[#272822] rounded-b-[50rem] overflow-hidden"
          style={{
          "--tube-percentage": `${percentage}%`,
          "--tube-color": color,
          "--tube-title": `"${percentage}%"`,
        }}
      >
        {/* Top cap */}
        <div className="absolute -top-[3px] left-[-10px] w-[calc(100%+20px)] h-[8px] bg-[#272822] rounded-full" />

        {/* Shine */}
        <div className="absolute left-[10%] top-0 w-[10%] h-full opacity-20 z-50">
          <div className="absolute top-[10%] w-full h-[40%] bg-white rounded-full" />
          <div className="absolute top-[60%] w-full h-[15%] bg-white rounded-full" />
        </div>

        {/* Liquid Container */}
        <div className="absolute bottom-0 w-full h-full overflow-hidden">
          <div
            className="absolute bottom-0 w-full transition-all duration-1000"
            style={{ height: "var(--tube-percentage)" }}
          >
            {/* Liquid Waves */}
            <div
              className="absolute left-1/2 top-0 w-[200px] h-[200px] rounded-[75px] animate-liquid"
              style={{
                background: "var(--tube-color)",
                transform: "translateX(-50%)",
              }}
            />
            <div
              className="absolute left-1/2 top-0 w-[200px] h-[200px] rounded-[60px] opacity-40 animate-liquid-reverse"
              style={{
                background: "var(--tube-color)",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>

        {/* Bubbles */}
        <div className="absolute bottom-0 w-full h-full pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[10px] h-[10px] rounded-[50%_50%_0_50%] opacity-80 animate-bubble"
              style={{
                background: "var(--tube-color)",
                left: `${30 + i * 5}%`,
                bottom: "calc(var(--tube-percentage) / 3)",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Percentage Label Bubble */}
        <div
          className="absolute left-full ml-3 bottom-[var(--tube-percentage)] translate-y-1/2"
        >
          <div
            className="px-3 py-2 text-sm font-bold rounded-full"
            style={{
              background: "var(--tube-color)",
              color: "#1D1D19",
            }}
          >
            {percentage}%
          </div>
        </div>
      </div>

      {/* Department Label */}
      <div className="mt-3 text-white font-semibold">{label}</div>

      {/* Keyframes */}
      <style>
        {`
        @keyframes liquid {
          0% { transform: translateX(-50%) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(360deg); }
        }

        @keyframes bubble {
          0% {
            transform: scale(0.3) rotate(50deg);
            bottom: calc(var(--tube-percentage) / 3);
            opacity: 0.8;
          }
          50% {
            transform: scale(0.8) rotate(50deg);
          }
          100% {
            bottom: 130%;
            opacity: 0;
            transform: scale(1) rotate(50deg);
          }
        }

        .animate-liquid {
          animation: liquid 4s infinite linear;
        }

        .animate-liquid-reverse {
          animation: liquid 4s infinite linear reverse;
        }

        .animate-bubble {
          animation: bubble 3s infinite linear;
        }
        `}
      </style>
    </div>
  );
};

export default Tube;
