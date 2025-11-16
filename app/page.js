"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";



const App = () => {
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const primaryColor = "bg-highlight";
  const primaryHoverColor = "hover:bg-[#6e0000]";

  const handleNavigate = async () => {
    if (!rollNo.trim()) return;

    setLoading(true);
    // Simulate small delay if needed
    router.push(`/result?rollNo=${rollNo.trim()}`);
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
      <div className="fixed top-0 left-0 w-full h-full inset-0 bg-gradient-to-r from-blue-900 to-pink-900 opacity-50 bg-blend-color-burn"></div>

      <div className="relative bg-white py-14 px-10 w-full max-w-xs sm:max-w-sm mx-auto text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-inner flex items-center justify-center overflow-hidden">
            <img
              src="https://erp.aktu.ac.in/Images/Site/FileHandler-new.png"
              alt="University Logo Placeholder"
              className="w-full h-full object-cover"
            />
          </div>
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

          <button
            onClick={handleNavigate}
            disabled={!rollNo.trim() || loading}
            className="flex items-center bg-highlight justify-center mx-auto px-10 py-3 font-medium text-white transition duration-200 shadow-md transform hover:scale-[1.01] ${rollNo.trim()
                  cursor-pointer "             
          >

            {loading ? (
             <>
             Loading .. <AiOutlineLoading3Quarters className="animate-spin text-xl" />
             </> 
            ) : (
              "आगे बढ़ें"
            )}
          </button>
        </div>

        <p
          className="text-xs text-gray-500 mt-6 leading-relaxed"
          style={{ fontFamily: "Inter, Arial, sans-serif" }}
        >
          यह डॉ ए पी जे अब्दुल कलाम तकनीकी विश्वविद्यालय लखनऊ की आधिकारिक ईo आरo पीo है। <br/>
          (एoकेoटीoयूo-एसडीसी द्वारा संचालित)
        </p>
      </div>
    </div>
  );
};

export default App;
