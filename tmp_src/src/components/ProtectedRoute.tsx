import { Navigate } from "react-router-dom";
import { useAuth, EventsRole } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: EventsRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isContentManager, eventsProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;

  // Fallback for when profile isn't loaded yet: assume valid if user exists and they have an admin globalRole, OR if they're still waiting for eventsProfile to load.
  const effectiveIsAdmin = isAdmin() || (!eventsProfile && (user.globalRole === "ADMIN" || user.eventsRole === "ADMIN"));
  
  // For CONTENT_MANAGER, if eventsProfile is null, we shouldn't immediately reject them if they are authenticated
  // and we're just waiting for their profile to load (which is already covered by the `loading` check, 
  // but just in case of state desync where user loaded but profile didn't yet).
  const effectiveIsContentManager = isContentManager() || (!eventsProfile && (user.eventsRole === "CONTENT_MANAGER" || user.globalRole === "ADMIN"));

  if (requiredRole === "ADMIN" && !effectiveIsAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "CONTENT_MANAGER" && !effectiveIsContentManager && !effectiveIsAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
