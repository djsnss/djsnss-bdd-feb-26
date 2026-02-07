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
  const showToast = notificationQueue.shift();

  const toastId = showToast();

  // EXACT duration control (4s)
  setTimeout(() => {
    toast.dismiss(toastId);
    isShowing = false;
    processQueue(); // move to next ONLY after dismiss
  }, 4000);
};

/* =========================
   Toast UI
========================= */
const DonationToast = ({ donor, department, bloodGroup, visible }) => {
  return (
    <div
      className={`${
        visible ? "animate-enter" : "animate-leave"
      } relative max-w-sm w-full backdrop-blur-xl shadow-2xl rounded-3xl pointer-events-auto overflow-hidden`}
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%)",
        boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}
    >
      {/* Top gradient accent */}
      <div 
        className="h-1"
        style={{
          background: "linear-gradient(90deg, #e74c3c 0%, #f39c12 50%, #e74c3c 100%)",
        }}
      />

      {/* Dismiss button - positioned absolute */}
      <button
        onClick={() => toast.dismiss()}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-400 hover:text-gray-600 hover:bg-gray-200/80 transition-all z-10"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2 pr-6">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
              }}
            >
              <span className="text-base">🩸</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Blood Donation
              </p>
              <p className="text-[10px] text-gray-400">just now</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-gray-400">LIVE</span>
          </div>
        </div>

        {/* Main content - Name is the hero */}
        <div className="text-center py-1">
          <p 
            className="text-lg font-bold mb-1"
            style={{
              background: "linear-gradient(135deg, #1768AA 0%, #2980b9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {donor}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <span className="font-bold">{department}</span>
            {bloodGroup && (
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                }}
              >
                {bloodGroup}
              </span>
            )}
          </div>
        </div>

        {/* Footer message */}
        <div 
          className="mt-2 py-1.5 px-2 rounded-lg text-center"
          style={{
            background: "linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(241, 196, 15, 0.1) 100%)",
          }}
        >
          <p className="text-[11px] font-medium text-gray-700">
            🎉 Thank you for donating blood! 💖
          </p>
        </div>
      </div>
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
  notificationQueue.push(() => {
    return toast.custom(
      (t) => (
        <DonationToast
          donor={donor}
          department={department}
          bloodGroup={bloodGroup}
          visible={t.visible}
        />
      ),
      {
        duration: Infinity, // 👈 we control dismissal
        position: "top-right",
      },
    );
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