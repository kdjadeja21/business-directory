"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/Loader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/signin") {
      router.push("/admin/signin");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <Loader />;
  }

  if (!user && pathname !== "/admin/signin") {
    return null;
  }

  return <>{children}</>;
}
