import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [institutionEmail, setInstitutionEmail] = useState("");
  const [institutionPassword, setInstitutionPassword] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInstitutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: institutionEmail,
        password: institutionPassword,
      });

      if (error) throw error;

      // Check user role
      const { data: user } = await supabase.auth.getUser();
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.user?.id)
        .single();

      console.log("Login - User ID:", user.user?.id);
      console.log("Login - Profile data:", profile);
      console.log("Login - Profile error:", profileError);

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error(`Unable to fetch profile: ${profileError?.message || 'Profile not found'}. Please ensure your account has been properly set up.`);
      }

      if (profile.role === "student") {
        await supabase.auth.signOut();
        throw new Error("Please use the student login tab");
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });

      // Navigate based on role
      if (profile.role === "super_admin") {
        navigate("/superadmin");
      } else {
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: studentEmail,
        password: studentPassword,
      });

      if (error) throw error;

      // Check if user is a student
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profile?.role !== "student") {
        await supabase.auth.signOut();
        throw new Error("This account is not registered as a student. Please use the institution login tab.");
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });

      navigate("/student");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="pt-20 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md mx-4">
          <Card className="gradient-card border-0 shadow-feature">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <CardTitle className="text-2xl">Welcome to Acadira</CardTitle>
              <p className="text-muted-foreground">Sign in to access your AI tutoring platform</p>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="institution" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="institution">Institution</TabsTrigger>
                  <TabsTrigger value="student">Student</TabsTrigger>
                </TabsList>
                
                <TabsContent value="institution" className="space-y-4">
                  <form onSubmit={handleInstitutionSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution-email">Email</Label>
                      <Input 
                        id="institution-email" 
                        type="email"
                        placeholder="admin@institution.edu"
                        value={institutionEmail}
                        onChange={(e) => setInstitutionEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="institution-password">Password</Label>
                      <Input 
                        id="institution-password" 
                        type="password"
                        placeholder="Enter your password"
                        value={institutionPassword}
                        onChange={(e) => setInstitutionPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <Button type="submit" variant="cta" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In to Admin Dashboard"
                      )}
                    </Button>
                  </form>
                  
                  <div className="text-center space-y-2">
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot your password?
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link to="/pricing" className="text-primary hover:underline">
                        Subscribe to Acadira
                      </Link>
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="student" className="space-y-4">
                  <form onSubmit={handleStudentSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-email">Student Email</Label>
                      <Input 
                        id="student-email" 
                        type="email"
                        placeholder="student@institution.edu"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="student-password">Password</Label>
                      <Input 
                        id="student-password" 
                        type="password"
                        placeholder="Institution provided password"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <Button type="submit" variant="cta" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Access AI Tutor"
                      )}
                    </Button>
                  </form>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Student credentials are provided by your institution. 
                      Contact your administrator if you need access.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Link to="/contact" className="text-sm text-primary hover:underline">
                      Need help with student login?
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Secured by Xovaxy • Enterprise-grade security
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;