"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaPrint, FaSpinner } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function GetResult({ rollNo, token }) {
  const [loading, setLoading] = useState(false);
  const [bodyContent, setBodyContent] = useState("");
  const [scripts, setScripts] = useState([]);
  const resultRef = useRef(null);
  const router = useRouter();

  // Mobile warning
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      toast.info(
        "For best visibility, please enable Desktop Mode on your mobile browser.",
        { autoClose: 6000 }
      );
    }
  }, []);

  // Fetch result
  useEffect(() => {
    if (rollNo?.trim()) fetchResult();
  }, [rollNo]);

  async function fetchResult() {
    if (!rollNo?.trim()) return toast.error("⚠ Missing roll number");
    setLoading(true);
    setBodyContent("");
    setScripts([]);

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
      if (!html) return toast.error("No HTML returned from server");

      // Extract body content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const body = doc.body.innerHTML;
      setBodyContent(body);

      // Extract script contents
      const scriptTags = Array.from(doc.querySelectorAll("script"));
      const inlineScripts = scriptTags
        .map((s) => s.innerHTML)
        .filter(Boolean);
      setScripts(inlineScripts);
    } catch (err) {
      console.error("❌ Error fetching result:", err);
      toast.error(`Failed to load result: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Run scripts after body renders
  useEffect(() => {
    if (!bodyContent || !scripts.length) return;

    scripts.forEach((code) => {
      try {
        const fn = new Function(code);
        fn();
      } catch (err) {
        console.warn("Script error:", err);
      }
    });
  }, [bodyContent, scripts]);

  // Accordion + link disable
  useEffect(() => {
    if (!bodyContent || !resultRef.current) return;

    const headers = resultRef.current.querySelectorAll(".headerclass");

    headers.forEach((header) => {
      // Remove old listeners
      header.replaceWith(header.cloneNode(true));
    });

    const newHeaders = resultRef.current.querySelectorAll(".headerclass");

    newHeaders.forEach((header) => {
      header.style.cursor = "pointer";
      header.addEventListener("click", () => {
        const id = header.id;
        const target = resultRef.current.querySelector(`.contentclass[id='${id}']`);
        if (target) {
          const isHidden = target.style.display === "none" || !target.style.display;
          target.style.display = isHidden ? "block" : "none";
          header.style.backgroundColor = isHidden ? "#fff9db" : "";
          if (isHidden) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Disable all links
    resultRef.current.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => e.preventDefault());
      link.style.pointerEvents = "none";
      link.style.color = "gray";
    });
  }, [bodyContent]);

function handlePrint() {
  if (!resultRef.current || loading) return toast.warn("⚠ Result not ready!");

  // Clone the node so we capture the current state
  const clone = resultRef.current.cloneNode(true);

  // Create a temporary container
  const printContainer = document.createElement("div");
  printContainer.style.position = "absolute";
  printContainer.style.top = "0";
  printContainer.style.left = "0";
  printContainer.style.width = "100%";
  printContainer.style.zIndex = "-1"; // keep it out of view
  printContainer.appendChild(clone);
  document.body.appendChild(printContainer);

  // Print
  window.print();

  // Remove temporary container after print
  document.body.removeChild(printContainer);
}



  return (
    <div className="min-h-screen w-full bg-gray-50 sm:p-6">
      {/* Header */}
      <header className="mb-6 p-5 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Result Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Roll Number: <span className="font-medium text-indigo-600">{rollNo}</span>
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-black transition-all font-medium text-white shadow-lg text-sm active:scale-95"
          >
            <IoIosArrowRoundBack className="text-sm" /> New Search
          </button>

          <button
            onClick={handlePrint}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all font-medium text-white disabled:opacity-60 shadow-lg text-sm active:scale-95"
          >
            {loading ? <FaSpinner className="animate-spin text-sm" /> : <FaPrint className="text-sm" />}
            Print
          </button>
        </div>
      </header>

      {/* Result Viewer */}
      <div className="relative bg-white border border-gray-200 rounded-xl p-5 overflow-x-auto">
        {loading && (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-50 backdrop-blur-sm transition-opacity duration-300">
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-xl border border-gray-200">
      <FaSpinner className="animate-spin text-indigo-600 text-6xl" />
      <p className="text-lg sm:text-xl font-semibold text-gray-700">
        Fetching Your Result...
      </p>
      <p className="text-sm text-gray-500">Please wait while we load your data.</p>
    </div>
  </div>
)}


        {bodyContent && (
          <div
            ref={resultRef}
            className="result-wrapper text-black"
            dangerouslySetInnerHTML={{ __html: bodyContent }}
          />
        )}
      </div>
    </div>
  );
}
