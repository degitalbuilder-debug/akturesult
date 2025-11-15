"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaHome, FaPrint, FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function GetResult({ rollNo, token }) {
  const [loading, setLoading] = useState(false);
  // State for dynamic height calculation
  const [iframeHeight, setIframeHeight] = useState('900px'); 
  const iframeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (rollNo && rollNo.trim()) fetchResult();
  }, [rollNo]);

  async function fetchResult() {
    if (!rollNo?.trim()) return toast.error("⚠ Missing roll number");

    setLoading(true);
    setIframeHeight('900px'); 

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

        // Function to dynamically measure content height and update state
        const adjustIframeHeight = () => {
          const body = doc.body;
          if (body) {
            // Use scrollHeight for accurate content height + buffer
            const contentHeight = body.scrollHeight + 40; 
            setIframeHeight(`${contentHeight}px`);
          }
        };

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
              setTimeout(adjustIframeHeight, 50);
            });
          });

          // Responsive and Aesthetic styles injection
          const style = doc.createElement("style");
          style.textContent = `
            /* CRITICAL FIXES: Force all elements to respect 100% width */
            *, *::before, *::after {
                max-width: 100% !important;
                box-sizing: border-box;
            }

            html, body {
              width: 100%; 
              overflow-x: hidden; 
              font-family: Arial, sans-serif;
              padding: 0;
              margin: 0;
            }
            .result-wrapper {
                padding: 15px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            
            /* 🔥🔥🔥 CORE TABLE WIDTH FIXES 🔥🔥🔥 */
            table {
                width: 100% !important; 
                max-width: 100%;
                /* Use display: table to ensure cells calculate widths properly */
                display: table; 
                border-collapse: collapse;
                margin-bottom: 1rem;
            }
            
            /* Force internal table structure elements to 100% width of their container, 
               and maintain correct table display properties */
            tbody, thead, tfoot {
                width: 100% !important; 
                display: table-row-group !important;
            }

            tr {
                width: 100% !important;
                display: table-row !important;
            }
            
            /* Allow cells to split the width, but ensure they don't have fixed legacy widths */
            td, th {
                width: auto !important; 
                display: table-cell !important;
                white-space: normal;
                padding: 8px;
                /* If the user still sees horizontal scroll, uncomment the overflow line below, 
                   but it can make text unreadable on wide cells. */
                /* overflow-x: hidden; */ 
            }
            /* End CORE TABLE WIDTH FIXES */

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
            @media (max-width: 768px) {
              /* Mobile styles */
            }
          `;
          doc.head.appendChild(style);

          // Final height adjustment
          adjustIframeHeight();
          toast.success("✅ Result loaded successfully!");
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
    <div className="min-h-screen w-full bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto"> 
        
        {/* Header/Action Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 mb-3 sm:mb-0">
            Result for Roll No: <span className="text-indigo-600">{rollNo}</span>
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 transition-colors font-medium text-white shadow-md text-sm"
            >
              <FaHome /> New Search
            </button>

            <button
              onClick={handlePrint}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors font-medium text-white disabled:opacity-60 shadow-md text-sm"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPrint />
              )}{" "}
              Print Result
            </button>
          </div>
        </header>

        {/* Result Viewer Container */}
        <div className="relative bg-white p-2 sm:p-6 border border-gray-200 rounded-xl shadow-2xl">
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
            className="w-full bg-white"
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