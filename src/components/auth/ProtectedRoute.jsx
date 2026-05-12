import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !hasRole(roles)) return <Navigate to="/dashboard" />;

  return <AppLayout>{children}</AppLayout>;
}
