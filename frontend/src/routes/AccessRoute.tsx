'use client';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner/Spinner";


interface AccessRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export default function AccessRoute({
  children,
  requiredRoles = [],
  requiredPermissions = [],
}: AccessRouteProps) {
  const { loading, hasRole, hasPermission } = useAuth();
  const router = useRouter();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      let allowed = true;

      if (requiredRoles.length > 0) {
        allowed = requiredRoles.some(role => hasRole(role));
      }

      if (allowed && requiredPermissions.length > 0) {
        allowed = requiredPermissions.some(perm => hasPermission(perm));
      }

      if (!allowed) {
        router.replace("/unauthorized");
      } else {
        setAccessChecked(true);
      }
    }
  }, [loading, hasRole, hasPermission, requiredRoles, requiredPermissions, router]);

  // Show loader while checking access
  if (loading || !accessChecked) {
    return (
        <Spinner mode="content" />
    );
  }

  // Render children only if access granted
  return <>{children}</>;
}
