import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function AuthWrapper({ children, allowedRoles }: AuthWrapperProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (!roleData) {
        navigate("/auth");
        return;
      }

      const userRole = roleData.role as UserRole;

      // Check if user has permission for this route
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        if (userRole === "buyer") {
          navigate("/buyer/dashboard");
        } else if (userRole === "seller") {
          navigate("/vendor/dashboard");
        } else if (userRole === "admin") {
          navigate("/admin/dashboard");
        }
        return;
      }

      setAuthorized(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
