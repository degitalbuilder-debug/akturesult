"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ for navigation
import { Search } from "lucide-react";
import Link from "next/link";

const LogoSeal = () => (
  <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-inner flex items-center justify-center overflow-hidden">
    <img
      src="https://erp.aktu.ac.in/Images/Site/FileHandler-new.png"
      alt="University Logo Placeholder"
      className="w-full h-full object-cover"
    />
  </div>
);

const App = () => {
  const [rollNo, setRollNo] = useState("");
  const router = useRouter(); // ✅ initialize router

  const primaryColor = "bg-highlight";
  const primaryHoverColor = "hover:bg-[#6e0000]";

  // ✅ Navigate when button clicked
  const handleCheckResult = () => {
    if (rollNo.trim()) {
      router.push(`/result?rollNo=${rollNo.trim()}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://erp.aktu.ac.in/Images/Site/bg-01.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-pink-900 opacity-50 bg-blend-color-burn"></div>

      <div className="relative bg-white py-14 px-10 w-full max-w-xs sm:max-w-sm mx-auto text-center">
        <div className="mb-6">
          <LogoSeal />
        </div>

        <h1 className="text-3xl text-highlight mb-8">एकेटीयू वनव्यू</h1>

        <div className="space-y-6">
          <input
            type="number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="अनुक्रमांक"
            className="w-full px-4 py-3 border border-gray-300 text-highlight focus:outline-none transition duration-150"
            style={{ fontFamily: "Inter, Arial, sans-serif" }}
          />

          {/* ✅ Button now uses onClick navigation instead of Link */}
          <button
            onClick={handleCheckResult}
            disabled={!rollNo.trim()}
            className={`flex items-center justify-center mx-auto px-10 py-3 font-medium text-white transition duration-200 shadow-md transform hover:scale-[1.01] ${
              rollNo.trim()
                ? `${primaryColor} ${primaryHoverColor} cursor-pointer`
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            आगे बढ़ें
          </button>
        </div>

        <p
          className="text-xs text-gray-500 mt-6 leading-relaxed"
          style={{ fontFamily: "Inter, Arial, sans-serif" }}
        >
          यह यू.पी. के विस्तृत आवश्यक नियमों/कानूनों/विनियमावली तथा मानकों की
          अभिव्यक्ति हेतु मात्र है।
        </p>
      </div>
    </div>
  );
};

export default App;
