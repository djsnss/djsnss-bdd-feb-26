import toast, { Toaster } from "react-hot-toast";

/* =========================
   Queue State
========================= */
let notificationQueue = [];
let isShowing = false;

/* =========================
   Queue Processor
========================= */
const processQueue = () => {
  if (isShowing || notificationQueue.length === 0) return;

  isShowing = true;
  const item = notificationQueue.shift();

  // Legacy function-based items
  if (typeof item === "function") {
    const toastId = item();
    setTimeout(() => {
      toast.dismiss(toastId);
      isShowing = false;
      processQueue();
    }, 6000);
    return;
  }

  // Pure data object — show via PipeSystem events
  if (item.department) {
    window.dispatchEvent(
      new CustomEvent("donation-show", {
        detail: item,
      }),
    );
  }

  // Auto-dismiss after 6s, then trigger pipe flow
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent("donation-hide"));
    isShowing = false;

    if (item.department) {
      window.dispatchEvent(
        new CustomEvent("donation-dismissed", {
          detail: { department: item.department },
        }),
      );
    }

    if (notificationQueue.length === 0) {
      window.dispatchEvent(new CustomEvent("donation-queue-empty"));
    }

    processQueue();
  }, 6000);
};

/* =========================
   Toast UI (Exported for Pipe.jsx)
========================= */
export const DonationToast = ({
  donor,
  department,
  bloodGroup,
  visible = true,
}) => {
  return (
    /* Camo border wrapper */
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: "16px",
        padding: "8px",
        background: "#5a6b32",
        boxShadow:
          "0 6px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.2)",
      }}
    >
      {/* Large organic camo blobs — like the reference image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          background: `
            radial-gradient(ellipse 90px 50px at 10% 20%, #3d4f1e 60%, transparent 61%),
            radial-gradient(ellipse 70px 60px at 85% 15%, #3d4f1e 60%, transparent 61%),
            radial-gradient(ellipse 100px 45px at 50% 85%, #3d4f1e 60%, transparent 61%),
            radial-gradient(ellipse 60px 50px at 25% 75%, #3d4f1e 60%, transparent 61%),
            radial-gradient(ellipse 80px 55px at 75% 70%, #8b7d3c 60%, transparent 61%),
            radial-gradient(ellipse 110px 50px at 40% 30%, #8b7d3c 60%, transparent 61%),
            radial-gradient(ellipse 70px 40px at 90% 50%, #8b7d3c 60%, transparent 61%),
            radial-gradient(ellipse 85px 60px at 15% 50%, #6b7c3d 60%, transparent 61%),
            radial-gradient(ellipse 90px 45px at 60% 10%, #6b7c3d 60%, transparent 61%),
            radial-gradient(ellipse 75px 55px at 70% 40%, #4a5c2a 60%, transparent 61%)
          `,
        }}
      />

      {/* Inner white card */}
      <div
        className="relative backdrop-blur-xl shadow-2xl pointer-events-auto overflow-hidden"
        style={{
          borderRadius: "16px",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.97) 0%, rgba(248,250,255,0.97) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* Top shimmer accent */}
        <div
          className="h-1.5"
          style={{
            background:
              "linear-gradient(90deg, #e74c3c 0%, #f39c12 30%, #e74c3c 60%, #f39c12 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s linear infinite",
          }}
        />

        <div className="p-3">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                }}
              >
                <span className="text-lg">🩸</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Blood Donation
                </p>
                <p className="text-[11px] text-gray-400">just now</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-gray-400">
                LIVE
              </span>
            </div>
          </div>

          {/* Main content — donor name */}
          <div className="text-center py-1">
            <p
              className="text-xl font-extrabold mb-1"
              style={{
                background: "linear-gradient(135deg, #1768AA 0%, #2980b9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {donor}
            </p>
            <div className="flex items-center justify-center gap-3 text-base text-gray-600">
              <span className="font-bold">{department}</span>
              {bloodGroup && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                  }}
                >
                  {bloodGroup}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className="mt-2 py-1 px-3 rounded-xl text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(231, 76, 60, 0.08) 0%, rgba(241, 196, 15, 0.08) 100%)",
            }}
          >
            <p className="text-xs font-medium text-gray-700">
              🎉 Thank you for donating blood! 💖
            </p>
          </div>
        </div>
      </div>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

/* =========================
   Public API
========================= */
export const showDonationNotification = (
  donor,
  department,
  bloodGroup = null,
) => {
  notificationQueue.push({
    donor,
    department,
    bloodGroup,
  });

  processQueue();
};

export const showMultipleDonationsNotification = (department, count) => {
  notificationQueue.push(() => {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-2xl rounded-2xl flex ring-1 ring-black/5 overflow-hidden`}
        >
          <div className="w-1.5 bg-red-600" />
          <div className="flex-1 p-4">
            <p className="text-xs font-semibold text-gray-500">
              Blood Donation Drive
            </p>
            <p className="text-sm font-bold text-gray-900 mt-1">
              🎉 {count} New Donations!
            </p>
            <p className="text-sm text-gray-700">
              {department} received{" "}
              <span className="font-bold text-blue-600">{count}</span> donations
            </p>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-right",
      },
    );
  });

  processQueue();
};

/* =========================
   Toaster
========================= */
export const DonationToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      style: {
        background: "transparent",
        boxShadow: "none",
        padding: 0,
      },
    }}
  />
);

export default DonationToaster;
