import toast, { Toaster } from "react-hot-toast";

// Notification queue management
let notificationQueue = [];
let isNotificationShowing = false;

const processNotificationQueue = async () => {
  if (isNotificationShowing || notificationQueue.length === 0) {
    return;
  }

  isNotificationShowing = true;
  const notification = notificationQueue.shift();

  // Show the notification
  notification();

  // Wait for the notification to disappear (2 seconds) + animation time (300ms)
  await new Promise((resolve) => setTimeout(resolve, 2300));

  isNotificationShowing = false;

  // Process next in queue
  if (notificationQueue.length > 0) {
    processNotificationQueue();
  }
};

// Custom notification component that looks like phone notifications
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

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
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
          <div className="flex items-center gap-1 mr-6">
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

      {/* Dismiss button */}
      <button
        onClick={() => toast.dismiss()}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-400 hover:text-gray-600 hover:bg-gray-200/80 transition-all"
      >
        <svg
          className="w-3.5 h-3.5"
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

// Function to show donation notification
export const showDonationNotification = (
  donor,
  department,
  bloodGroup = null,
) => {
  notificationQueue.push(() => {
    toast.custom(
      (t) => (
        <DonationToast
          donor={donor}
          department={department}
          bloodGroup={bloodGroup}
          visible={t.visible}
        />
      ),
      {
        duration: 2000,
        position: "top-right",
      },
    );
  });

  processNotificationQueue();
};

// Function to show multiple donations at once
export const showMultipleDonationsNotification = (department, count) => {
  notificationQueue.push(() => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 overflow-hidden`}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="w-1.5 flex-shrink-0"
            style={{
              background: "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)",
            }}
          />

          <div className="flex-1 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
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

            <div className="pl-10">
              <p className="text-sm font-bold text-gray-900 mb-1">
                🎉 {count} New Donation{count > 1 ? "s" : ""}!
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{department}</span> just
                received{" "}
                <span className="font-bold text-[#1768AA]">{count}</span> new
                donation{count > 1 ? "s" : ""}!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Every drop counts! 💖
              </p>
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t.id)}
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
      ),
      {
        duration: 2000,
        position: "top-right",
      },
    );
  });

  processNotificationQueue();
};

// Custom Toaster wrapper with styling
export const DonationToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 2000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
      }}
    />
  );
};

export default DonationToaster;
