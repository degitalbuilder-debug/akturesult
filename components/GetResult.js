"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {  FaPrint, FaSpinner } from "react-icons/fa";
import { IoIosArrowRoundBack  } from "react-icons/io";
 
export default function GetResult({ rollNo, token }) {
  const [loading, setLoading] = useState(false);
  // State for dynamic height calculation
  const [iframeHeight, setIframeHeight] = useState('900px'); 
  const iframeRef = useRef(null);
  const router = useRouter();
useEffect(() => {
  if (typeof window !== "undefined") {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      toast.info(" For best visibility, please enable Desktop Mode on your mobile browser.", {
        autoClose: 6000,
      });
    }
  }
}, []);

  useEffect(() => {
    if (rollNo && rollNo.trim()) fetchResult();
  }, [rollNo]);

  async function fetchResult() {
    if (!rollNo?.trim()) return toast.error("⚠ Missing roll number");

    setLoading(true);
    setIframeHeight('900px'); // Reset height while loading

    try {
      const res = await fetch("https://shhapi.vercel.app/api/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secure-token": token,
        },
        body: JSON.stringify({ rollNo }),
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch result");
      }

      const { result: html } = await res.json();

      if (html && iframeRef.current) {
        const cleanedHTML = html.replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          ""
        );

        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        doc.open();
        doc.write(`<div class="result-wrapper">${cleanedHTML}</div>`);
        doc.close();

        

        const initInteractive = () => {
          // Disable all links
          doc.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", (e) => e.preventDefault());
            link.style.pointerEvents = "none";
            link.style.color = "gray";
          });

          // Accordion logic for toggling tables
          const headers = doc.querySelectorAll(".headerclass");
          headers.forEach((header) => {
            header.style.cursor = "pointer";
            header.addEventListener("click", () => {
              const id = header.id;
              const target = doc.querySelector(`.contentclass[id='${id}']`);

              if (target) {
                const isHidden =
                  target.style.display === "none" || !target.style.display;
                target.style.display = isHidden ? "block" : "none";
                header.style.backgroundColor = isHidden ? "#fff9db" : ""; 
              }
              
              // Recalculate height after the content is toggled
               });
          });

          // Responsive and Aesthetic styles injection
          const style = doc.createElement("style");
          style.textContent = `
            /* Global Reset for Responsiveness */
            *, *::before, *::after {
                max-width: 100% !important;
                box-sizing: border-box;
            }

            html, body {
              width: 100%; 
              overflow-x: hidden; /* Prevents page-level scrollbars inside the iframe */
              font-family: Arial, sans-serif;
              padding: 0;
              margin: 0;
            }
            .result-wrapper {
                padding: 15px;
                width: 100%;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            
            /* 🔥 CORE TABLE RESPONSIVENESS FIXES (using table-layout: fixed) 🔥 */
            table {
                width: 100% !important; 
                max-width: 100%;
                border-collapse: collapse;
                margin-bottom: 1rem;
                table-layout: fixed; /* CRITICAL: Forces content to wrap */
            }
            
            td, th {
                width: auto !important; /* Override fixed inline widths */
                white-space: normal; /* Ensure text wraps */
                padding: 8px;
                word-break: break-word; /* Prevents overflow for long strings/IDs */
            }

            /* Mobile Fallback for Complex/Legacy Tables */
            @media (max-width: 600px) {
                table {
                    table-layout: auto;
                    display: block;
                    overflow-x: auto; /* Allows horizontal scroll on table if reflow fails */
                    -webkit-overflow-scrolling: touch;
                }
            }
            
            /* Accordion and Aesthetic Styles (Unchanged) */
            .headerclass {
              transition: background 0.3s ease;
              border-radius: 6px;
              padding: 10px;
              font-weight: bold;
              background-color: #f0f0f0; 
            }
            .headerclass:hover {
              background-color: #e0e0e0;
            }
            .contentclass {
                padding: 10px;
                border: 1px solid #eee;
                border-top: none;
                margin-bottom: 10px;
            }
          `;
          doc.head.appendChild(style);

        
        };

        if (doc.readyState === "complete" || doc.readyState === "interactive") {
          initInteractive();
        } else {
          doc.addEventListener("DOMContentLoaded", initInteractive);
          window.addEventListener("load", initInteractive);
        }
      } else {
        toast.error("No HTML returned from server");
      }
    } catch (err) {
      console.error("❌ Error fetching result:", err);
      toast.error(`Failed to load result: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    if (!iframeRef.current || loading)
      return toast.warn("⚠ Result not ready or currently loading!");
    const iframeWindow = iframeRef.current.contentWindow;
    iframeWindow.focus();
    iframeWindow.print();
  }

  return (
    <div className="min-h-screen w-full bg-gray-50   sm:p-6">
      <div className=" "> 
        
        {/* Header/Action Bar */}
       <header className="mb-6 p-5 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

  {/* Left Section */}
  <div className="flex flex-col">
    <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
      Result Overview
    </h1>
    <p className="text-sm text-gray-500 mt-1">
      Roll Number: <span className="font-medium text-indigo-600">{rollNo}</span>
    </p>
  </div>

  {/* Actions Section */}
  <div className="flex gap-3 w-full sm:w-auto justify-between sm:justify-end">
    <button
      onClick={() => router.push("/")}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-black 
                 transition-all font-medium text-white shadow-lg text-sm active:scale-95"
    >
      <IoIosArrowRoundBack className="text-sm" /> New Search
    </button>

    <button
      onClick={handlePrint}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 
                 hover:from-green-700 hover:to-green-800 transition-all font-medium text-white 
                 disabled:opacity-60 shadow-lg text-sm active:scale-95"
    >
      {loading ? (
        <FaSpinner className="animate-spin text-sm" />
      ) : (
        <FaPrint className="text-sm" />
      )}
      Print
    </button>
  </div>
</header>


        {/* Result Viewer Container */}
        <div className="relative bg-white border border-gray-200 rounded-xl h-fit  ">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 transition-opacity duration-300">
              <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
              <p className="mt-4 text-xl font-semibold text-indigo-600">
                Fetching Your Result...
              </p>
            </div>
          )}

          {/* Iframe: w-full and dynamic height from state */}
          <iframe
            ref={iframeRef}
            title={`Result for Roll No ${rollNo}`}
            className="w-full h-fit bg-white"
            style={{
              border: "none",
              height: iframeHeight,
              opacity: loading ? 0.5 : 1, 
              transition: "opacity 0.3s ease, height 0.3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}