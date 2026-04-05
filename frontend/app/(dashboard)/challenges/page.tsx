"use client";
import { challengesApi } from "@/lib/challenges";
import { useEffect } from "react";

export default function ChallengesPage() {
  
  useEffect(() => {
    challengesApi.getAll().then(challenges => {
      console.log("Fetched challenges:", challenges);
    }).catch(error => {
      console.error("Error fetching challenges:", error);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2]">
      <h1>Challenges</h1>
      <p>This is the Challenges page.</p>
    </div>
  );
}