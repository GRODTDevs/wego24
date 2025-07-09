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
        if (typeof window !== 'undefined') {
          console.log('[AuthContext] Auth state changed:', event, session?.user?.email, 'session:', session);
        }
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
      if (typeof window !== 'undefined') {
        console.log('[AuthContext] Initial session check:', session?.user?.email, 'session:', session);
      }
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
          if (isMounted) {
            setUserProfile(data);
          }
        });
    } else {
      setUserProfile(null);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthContext] Supabase signOut error:', error);
      }
    } catch (err) {
      console.error('[AuthContext] signOut exception:', err);
    } finally {
      // Always clear user/session state even if Supabase signOut fails
      setUser(null);
      setSession(null);
      // Remove all Supabase session keys from localStorage and sessionStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      });
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('user_role_') || key.startsWith('supabase.auth.')) {
          sessionStorage.removeItem(key);
        }
      });
    }
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
