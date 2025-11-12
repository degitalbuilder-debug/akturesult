"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaHome, FaPrint, FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function GetResult({ rollNo, token }) {
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (rollNo) fetchResult();
  }, [rollNo]);

  async function fetchResult() {
    if (!rollNo?.trim()) return toast.error("⚠ Missing roll number");

    setLoading(true);
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

      if (!res.ok) throw new Error("Failed to fetch result");

      const { result: html } = await res.json();

      if (html && iframeRef.current) {
        // 🧹 Clean scripts for safety but keep inline styles
        const cleanedHTML = html.replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          ""
        );

        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(cleanedHTML);
        doc.close();

        const initInteractive = () => {
          // Disable all links
          doc.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", (e) => e.preventDefault());
            link.style.pointerEvents = "none";
            link.style.color = "gray";
          });

          // ✅ Accordion logic — tables stay open until user closes them
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
            });
          });

          // 💅 Responsive fixes
          const style = doc.createElement("style");
          style.textContent = `
            html, body {
              width: 100%;
              overflow-x: hidden;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            .table-responsive {
              width: 100%;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            .headerclass {
              transition: background 0.3s ease;
              border-radius: 6px;
            }
            .headerclass:hover {
              background-color: #f9f9f9;
            }
            @media (max-width: 768px) {
              body {
                padding: 8px;
              }
              table {
                width: 100% !important;
                font-size: 11px !important;
              }
              td, th {
                padding: 4px !important;
                display: block;
                width: 100%;
              }
              .headerclass, .contentclass {
                margin-bottom: 10px;
              }
            }
          `;
          doc.head.appendChild(style);

          toast.success("✅ Result loaded successfully!");
        };

        if (doc.readyState === "complete" || doc.readyState === "interactive") {
          initInteractive();
        } else {
          doc.addEventListener("DOMContentLoaded", initInteractive);
        }
      } else {
        toast.error("No HTML returned from server");
      }
    } catch (err) {
      console.error("❌ Error fetching result:", err);
      toast.error("Failed to load result");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    if (!iframeRef.current) return toast.warn("⚠ Nothing to print!");
    const iframeWindow = iframeRef.current.contentWindow;
    iframeWindow.focus();
    iframeWindow.print();
  }

  return (
    <div className="w-full pt-10  text-center">
      {/* 🏠 Home button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-3 left-3 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 transition-colors font-medium text-white"
      >
        <FaHome /> Home
      </button>

      {/* 🖨️ Print button */}
      <button
        onClick={handlePrint}
        disabled={loading}
        className="fixed top-3 left-28 flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors font-medium text-white disabled:opacity-60"
      >
        <FaPrint /> Print Result
      </button>

      {/* 🔁 Generate another result */}
      <button
        onClick={fetchResult}
        disabled={loading}
        className="fixed top-3 right-3 flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium text-white disabled:opacity-60"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" /> Loading...
          </>
        ) : (
          "Generate Another Result"
        )}
      </button>

         <iframe
          ref={iframeRef}
          title="Result Viewer"
          className="w-screen  bg-white min-h-[700px]"
          style={{ border: "none" }}
        /> 
    </div>
  );
}
