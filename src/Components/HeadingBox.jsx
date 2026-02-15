import React from "react";

const HeadingBox = ({ text }) => {
  return (
    <div className="flex justify-center w-full">

      {/* Military Border */}
      <div
        className="
          inline-block
          px-8 py-6
          rounded-2xl
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
            px-10 py-6
            min-w-[300px]
            max-w-[60vw]
            rounded-xl
            border-dashed border-4 border-[#4B5320]
            flex items-center justify-center
          "
        >
          <h2 className="
            text-2xl font-extrabold text-[#4B5320] text-center
            whitespace-normal break-words
          ">
            {text}
          </h2>
        </div>

      </div>
    </div>
  );
};

export default HeadingBox;
