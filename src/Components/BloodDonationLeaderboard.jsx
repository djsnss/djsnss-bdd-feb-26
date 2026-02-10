import { useEffect, useState, useRef } from "react";
import { showDonationNotification } from "./DonationNotification";

// API base URL - change this to match your backend
const API_BASE = 'https://djsnss-bdd25.onrender.com';

// Department data with fallback scores and additional info - Army Theme
const departmentData = [
  {
    id: "aids",
    name: "AIDS",
    score: 0,
    image: "/assets/Mercury-removebg-preview.png",
    rocket: "/assets/rocket.png",
    color: "linear-gradient(270deg, #8B7355 70%, #D4A574 100%)"
  },
  {
    id: "aiml",
    name: "AIML",
    score: 0,
    image: "/assets/Venus-removebg-preview.png",
    rocket: "/assets/rocket.png",
    color: "linear-gradient(270deg, #5C4033 70%, #C4A484 100%)"
  },
  {
    id: "comps",
    name: "COMPS",
    score: 0,
    image: "/assets/Earth-removebg-preview.png",
    rocket: "/assets/rocket.png",
    color: "linear-gradient(270deg, #4A5D23 70%, #8FBC8F 100%)"
  },
  {
    id: "cseds",
    name: "CSEDS",
    score: 0,
    image: "/assets/Mars-removebg-preview.png",
    rocket: "/assets/rocket.png",
    color: "linear-gradient(270deg, #8B4513 70%, #DEB887 100%)"
  },
  {
    id: "extc",
    name: "EXTC",
    score: 0,
    image: "/assets/Jupiter-removebg-preview.png",
    rocket: "/assets/rocket.png",
    color: "linear-gradient(270deg, #6B4423 70%, #D2691E 100%)"
  },
  {
    id: "icb",
    name: "ICB",
    score: 0,
    image: "/assets/Saturn-removebg-preview.png",
    rocket: "/assets/rocket.png",
    color: "linear-gradient(270deg, #3D3D3D 0%, #F5A511 100%)"
  },
  {
    id: "it",
    name: "IT",
    score: 90,
    image: "/assets/Uranus-removebg-preview.png",
    rocket: "/assets/rocket.png",
    color: "linear-gradient(270deg, #556B2F 70%, #9ACD32 100%)"
  },
  {
    id: "mech",
    name: "MECH",
    score: 0,
    image: "/assets/Neptune-removebg-preview.png",
    rocket: "/assets/rocket.png",
    color: "linear-gradient(270deg, #2F4F4F 70%, #708090 100%)"
  },
  // {
  //   id: "outsider",
  //   name: "Outsider",
  //   score: 0,
  //   image: "/assets/Sun.png",
  //   rocket: "/assets/rocket.png",
  //   color: "linear-gradient(90deg, #fdfd08ff 0%, #ea951dff 88.94%)"
  // },
];

export function BloodDonationLeaderboard() {
  const [animatedScores, setAnimatedScores] = useState(
    departmentData.map(() => 0)
  );
  const [targetScores, setTargetScores] = useState(departmentData.map(() => 0));
  const previousScoresRef = useRef(null);
  const seenDonorsRef = useRef(new Set());
  const isFirstFetch = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch counts
        const countsRes = await fetch(`${API_BASE}/bdd25/counts`);
        const countsData = await countsRes.json();
        
        const newScores = departmentData.map(
          dept => countsData[dept.name] ?? 0
        );
        
        // Fetch latest donors for notifications (only after first fetch)
        if (!isFirstFetch.current) {
          try {
            const donorsRes = await fetch(`${API_BASE}/bdd25/latest`);
            const donorsData = await donorsRes.json();
            
            // Show notification for each new donor
            // Expected format: [{ name: "John", department: "COMPS", bloodGroup: "O+", _id: "..." }, ...]
            if (Array.isArray(donorsData)) {
              donorsData.forEach(donor => {
                const donorId = donor._id || donor.id || `${donor.name}-${donor.department}-${donor.timestamp}`;
                
                if (!seenDonorsRef.current.has(donorId)) {
                  seenDonorsRef.current.add(donorId);
                  showDonationNotification(
                    donor.name || 'Anonymous',
                    donor.department || 'Unknown',
                    donor.bloodGroup || null
                  );
                }
              });
            }
          } catch (error) {
            console.error('Error fetching latest donors:', error);
          }
        } else {
          // On first fetch, just populate the seen donors set
          try {
            const donorsRes = await fetch(`${API_BASE}/bdd25/latest`);
            const donorsData = await donorsRes.json();
            
            if (Array.isArray(donorsData)) {
              donorsData.forEach(donor => {
                const donorId = donor._id || donor.id || `${donor.name}-${donor.department}-${donor.timestamp}`;
                seenDonorsRef.current.add(donorId);
              });
            }
          } catch (error) {
            console.error('Error fetching initial donors:', error);
          }
        }
        
        isFirstFetch.current = false;
        previousScoresRef.current = [...newScores];
        setTargetScores(newScores);
      } catch (error) {
        console.error('Error fetching leaderboard stats:', error);
      }
    };

    // Initial fetch.
    fetchData()
    // Poll every 7 seconds.
    const pollInterval = setInterval(fetchData, 7000)
    return () => clearInterval(pollInterval)
  }, [])

  // Animate scores
  useEffect(() => {
    let interval = setInterval(() => {
      setAnimatedScores((prev) => {
        const newScores = [...prev];
        let completed = true;
        for (let i = 0; i < departmentData.length; i++) {
          if (newScores[i] < targetScores[i]) {
            newScores[i] += 1;
            completed = false;
          } else if (newScores[i] > targetScores[i]) {
            newScores[i] -= 1;
            completed = false;
          }
        }
        if (completed) {
          clearInterval(interval);
        }
        return newScores;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [targetScores]);

  const highestScore = Math.max(...targetScores)+10;
  const barMax = highestScore + 10;

  return (
    <div
      className="w-full rounded-3xl p-6 relative bg-transparent"
    >
      {/* Title - Army Theme */}
      <div className="flex justify-center items-center gap-4 mb-6">
         <img
          src="/assets/DJSNSSLogo.png"
          alt=""
          width={90}
          height={90}
          className="absolute left-6 top-4 p-2 bg-[#2D231A] rounded-full border-2 border-[#F3AD5C]"
          style={{ transform: "scaleX(1)" }}
        />
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F3AD5C] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          style={{ fontFamily: "'Raleway', sans-serif" }}
          >
          
            BLOOD DONATION DRIVE🩸
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#E8D5B7] tracking-wide mt-1 italic"
          style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            LEADERBOARD
          </h2>
        </div>
      </div>

      {/* Leaderboard bars */}
      <div className="space-y-6">
        {departmentData.map((dept, index) => {
          const widthPercentage =
            barMax > 0
              ? Math.min((animatedScores[index] / barMax) * 100, 100)
              : 0;

          return (
            <div key={dept.id} className="flex items-center gap-4">
              {/* Department name */}
              <div className="w-24 text-center">
                <span className="italic font-semibold text-2xl text-[#F3AD5C] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  {dept.name}
                </span>
              </div>

              {/* Progress bar container */}
              <div
                className="relative flex-1 h-12 rounded-full shadow-inner overflow-visible bg-[#3D2E1F] border border-[#5A4A35]"
              >
                <div className="overflow-hidden h-full rounded-full">
                  <div
                    className="h-full transition-all duration-300 ease-out"
                    style={{
                      width: `${widthPercentage}%`,
                      background: dept.color, // red to yellow gradient trail
                      borderRadius: "9999px", // keep rounded ends
                    }}
                  />
                </div>

                {/* rocket image */}
                <div
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 w-20 h-20"
                  style={{ left: `calc(${widthPercentage}% - 40px)` }}
                >
                  <img
                    src={dept.rocket || "/placeholder.svg"}
                    alt={`${dept.name} rocket`}
                    className="object-cover w-20 h-20 rounded-full"
                    style={{
                      //   filter: 'drop-shadow(3px 3px 5px rgba(0,0,0,0.4))',
                      transition: "transform 0.3s",
                      scale: "0.85",
                    }}
                  />
                </div>
              </div>

              {/* Planet image + Score */}
              <div className="flex items-center gap-2 w-24 justify-center">
                <img
                  src={dept.image}
                  alt={`${dept.name} planet`}
                  className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"
                  style={{
                    filter: "drop-shadow(2px 2px 5px rgba(0,0,0,0.3))",
                    scale: "1.2",
                  }}
                />
                <span className="font-bold text-2xl md:text-3xl text-[#2D231A] bg-[#F3AD5C] px-2 md:px-3 py-1 rounded-full border-2 border-[#D4922E]"
                style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  {animatedScores[index]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
