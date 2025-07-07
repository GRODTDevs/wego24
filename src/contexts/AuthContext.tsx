import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userProfile: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          // Only set loading to false after a slight delay to ensure all checks complete
          setTimeout(() => {
            if (isMounted) {
              setLoading(false);
            }
          }, 100);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        // Only set loading to false after a slight delay to ensure all checks complete
        setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, 100);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Fetch profile when user changes
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (isMounted) setUserProfile(data);
        });
    } else {
      setUserProfile(null);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    userProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
