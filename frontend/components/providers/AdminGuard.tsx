"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // wait for hydration
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      router.replace('/home');
      return;
    }

    setChecked(true);
  }, [isAuthenticated, user, router]);

  if (!checked) return null;
  return <>{children}</>;
}
