import { 
  Circle, Square, Triangle, 
  Server, Globe, Layers, Box,
  Flag, Target, Award
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChallengeLevel, ChallengeType } from "@/types/challenge.types";

/* ─── Difficulty Specifications ──────────────────────────────────────── */

export interface DifficultySpec {
  color: string;
  label: string;
  shape: typeof Circle;
  icon: typeof Flag;
  bgColor: string;
  borderColor: string;
}

// Map internal levels to UI specs
// Note: We handle both English and French keys for robustness
export const DIFFICULTY_SPECS: Record<string, DifficultySpec> = {
  EASY: { 
    color: "#10B981", 
    label: "EASY", 
    shape: Circle, 
    icon: Flag,
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0"
  },
  DEBUTANT: { 
    color: "#10B981", 
    label: "DÉBUTANT", 
    shape: Circle, 
    icon: Flag,
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0"
  },
  MEDIUM: { 
    color: "#F59E0B", 
    label: "MEDIUM", 
    shape: Square, 
    icon: Target,
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A"
  },
  INTERMEDIAIRE: { 
    color: "#F59E0B", 
    label: "INTERMÉDIAIRE", 
    shape: Square, 
    icon: Target,
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A"
  },
  HARD: { 
    color: "#EF4444", 
    label: "HARD", 
    shape: Triangle, 
    icon: Award,
    bgColor: "#FEF2F2",
    borderColor: "#FECACA"
  },
  AVANCE: { 
    color: "#EF4444", 
    label: "AVANCÉ", 
    shape: Triangle, 
    icon: Award,
    bgColor: "#FEF2F2",
    borderColor: "#FECACA"
  },
};

export const DEFAULT_DIFFICULTY_SPEC: DifficultySpec = {
  color: "#6B7280",
  label: "UNKNOWN",
  shape: Circle,
  icon: Flag,
  bgColor: "#F9FAFB",
  borderColor: "#E5E7EB"
};

/* ─── Module Type Specifications ─────────────────────────────────────── */

export interface ModuleConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  category: string;
}

export const MODULE_CONFIG: Record<ChallengeType, ModuleConfig> = {
  BACKEND: { 
    icon: Server, 
    label: "Backend", 
    color: "#1D4ED8", 
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    category: "Infrastructure"
  },
  FRONTEND: { 
    icon: Globe, 
    label: "Frontend", 
    color: "#B91C1C", 
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    category: "Interface"
  },
  FULLSTACK: { 
    icon: Layers, 
    label: "Fullstack", 
    color: "#6D28D9", 
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
    category: "End-to-End"
  },
};

export const DEFAULT_MODULE_CONFIG: ModuleConfig = {
  icon: Box,
  label: "Module",
  color: "#6B7280",
  bgColor: "#F9FAFB",
  borderColor: "#E5E7EB",
  category: "General"
};

/* ─── Filters ────────────────────────────────────────────────────────── */

export interface FilterItem {
  id: ChallengeType | "ALL";
  label: string;
  icon: LucideIcon;
  color: string;
}

export const CHALLENGE_FILTERS: FilterItem[] = [
  { id: "ALL", label: "All", icon: Box, color: "#111" },
  { id: "FRONTEND", label: "Frontend", icon: Globe, color: "#B91C1C" },
  { id: "BACKEND", label: "Backend", icon: Server, color: "#1D4ED8" },
  { id: "FULLSTACK", label: "Fullstack", icon: Layers, color: "#6D28D9" },
];
