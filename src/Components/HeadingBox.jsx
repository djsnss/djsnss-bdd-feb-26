import React from "react";

const HeadingBox = ({ text }) => {
  return (
    <div className="flex justify-center w-full">
      <div
        className="relative inline-block px-12 py-3 text-center"
        style={{
          backgroundImage: "url('/assets/HeadingBox.png')",
          backgroundSize: "100% ",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-3xl font-extrabold uppercase tracking-wider text-red-500 background-clip-text text-transparent bg-white p-8">
          Blood Donation Drive
        </h2>
      </div>
    </div>
  );
};

export default HeadingBox;
