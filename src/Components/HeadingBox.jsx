import React from "react";

const HeadingBox = ({ text }) => {
  return (
<div className="flex justify-center w-full mt-[3vh]"> 
      {/* Military Border */}
      <div
        className="
          inline-block
          px-[4.8vh] py-[3.8vh]
          rounded-[2vh]
        "
        style={{
          backgroundImage: "url('/assets/HeadingBox.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >

        {/* Cream Box */}
        <div
          className="
            bg-[#e6d2a1]
            px-[4.8vh] py-[3.8vh]
            min-w-[30vh]
            max-w-[70vh]
            rounded-[1.5vh]
            border-dashed border-[0.5vh] border-[#4B5320]
            flex items-center justify-center
          "
        >
          <h2
            className="
              font-extrabold text-[#4B5320] text-center
              whitespace-normal break-words
              text-[3.5vh]
            "
          >
            {text}
          </h2>
        </div>

      </div>
    </div>
  );
};

export default HeadingBox;
