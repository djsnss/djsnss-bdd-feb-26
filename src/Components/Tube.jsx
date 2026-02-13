import React from "react";

const Tube = ({ count = 0, color = "#dc2626", label = "COMPS" }) => {
  const percentage = Math.min(count * 8, 100);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-[55px] h-[260px] rounded-b-[50rem] overflow-hidden"
        style={{
          "--tube-percentage": `${percentage}%`,
          "--tube-color": color,
          background: "rgba(255,255,255,0.12)",
          border: "2px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(8px)",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Top cap */}
        <div
          className="absolute -top-[2px] left-[-8px] w-[calc(100%+16px)] h-[8px] rounded-full"
          style={{
            background: "rgba(255,255,255,0.3)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        />

        {/* Glass shine */}
        <div className="absolute left-[10%] top-0 w-[10%] h-full opacity-30 z-50">
          <div className="absolute top-[10%] w-full h-[40%] bg-white rounded-full" />
          <div className="absolute top-[60%] w-full h-[15%] bg-white rounded-full" />
        </div>

        {/* Liquid Container */}
        <div className="absolute bottom-0 w-full h-full overflow-hidden">
          <div
            className="absolute bottom-0 w-full transition-all duration-1000 ease-out"
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

        {/* Count badge — circle */}
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.85)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              backdropFilter: "blur(4px)",
              border: "2px solid rgba(255,255,255,0.5)",
            }}
          >
            <span
              className="text-base font-extrabold"
              style={{ color: count > 0 ? "#dc2626" : "#6b7280" }}
            >
              {count}
            </span>
          </div>
        </div>
      </div>

      {/* Department Label */}
      <div
        className="mt-3 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-center"
        style={{
          color: "#f5f0e1",
          background: "red",
          borderRadius: "8px",
          textShadow: "0 1px 2px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.15)",
          minWidth: "60px",
        }}
      >
        {label}
      </div>

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
