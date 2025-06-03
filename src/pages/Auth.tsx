
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        navigate("/character-sheet");
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.username);
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Welcome to Quest of Fitness Realm.",
        });
        navigate("/character-creation");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-parchment-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-parchment-50 rounded-3xl shadow-2xl p-8 space-y-6 border-4 border-parchment-500">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="p-2 hover:bg-parchment-200 text-parchment-600"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex justify-center flex-1">
            <Shield size={48} className="text-parchment-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-parchment-700 font-serif">
          {isLogin ? "Welcome Back" : "Join the Quest"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="username" className="text-parchment-700 font-serif">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required={!isLogin}
                className="mt-1 bg-parchment-200 border-2 border-parchment-400 text-parchment-700 rounded-xl font-serif"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email" className="text-parchment-700 font-serif">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 bg-parchment-200 border-2 border-parchment-400 text-parchment-700 rounded-xl font-serif"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-parchment-700 font-serif">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 bg-parchment-200 border-2 border-parchment-400 text-parchment-700 rounded-xl font-serif"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-parchment-500 hover:bg-parchment-600 text-parchment-50 font-serif py-3 rounded-2xl border-2 border-parchment-700 text-lg font-medium"
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
        </form>
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-parchment-600 hover:text-parchment-700 font-serif"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
