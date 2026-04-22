"use client"

import { apiFetch } from "@/lib/api";
import { useEffect } from "react";

export default function Test() {
    useEffect(() => {
        const fetchTestAnalysis = async () => {
            const response = await apiFetch<string>('/api/groq/test');
            console.log("Response from /api/groq/test", response);
        };
        fetchTestAnalysis();
    }, []);
    return (
        "test"
    )
}