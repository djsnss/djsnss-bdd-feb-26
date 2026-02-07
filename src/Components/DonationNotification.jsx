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
      } max-w-md w-full bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 overflow-hidden`}
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Left accent bar */}
      <div
        className="w-1.5 flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)",
        }}
      />

      <div className="flex-1 p-4">
        {/* Header with app icon and time */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md"
            style={{
              background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
            }}
          >
            🩸
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
              Blood Donation Drive
            </p>
            <p className="text-[10px] text-gray-400">just now</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>

        {/* Main content */}
        <div className="pl-10">
          <p className="text-sm font-bold text-gray-900 mb-1">
            🎉 New Donation!
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-[#1768AA]">{donor}</span> from{" "}
            <span className="font-semibold">{department}</span> just donated
            blood
            {bloodGroup && (
              <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                {bloodGroup}
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Thank you for saving lives! 💖
          </p>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => toast.dismiss()}
        className="flex-shrink-0 p-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
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