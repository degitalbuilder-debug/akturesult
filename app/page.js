"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [rollNo, setRollNo] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png" // replace with your logo path
            alt="University Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        <h1 className="text-2xl font-semibold mb-2 text-indigo-700">
          AKTU Result Portal
        </h1>
        <p className="text-gray-500 mb-6">Enter your roll number to view your result</p>

        <div className="space-y-4">
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="Enter Roll Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {rollNo.trim() ? (
            <Link
              href={`/result?rollNo=${encodeURIComponent(rollNo.trim())}`}
              className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition text-center"
            >
              Check Result
            </Link>
          ) : (
            <button
              disabled
              className="block w-full bg-gray-300 text-gray-600 py-3 rounded-xl font-medium cursor-not-allowed"
            >
              Enter Roll Number
            </button>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-6">
          © {new Date().getFullYear()} AKTU Result Checker
        </p>
      </div>
    </div>
  );
}
