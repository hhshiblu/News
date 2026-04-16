"use client";
import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { loginAction, signupAction } from "@/actions/auth";
import { toast } from "sonner";

// Social Icons SVGs for v1.x compatibility
const BrandIcons = {
  Google: () => (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  ),
  Github: () => (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
};

export default function LoginModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginAction(formData.email, formData.password);
        if (res.success) {
          toast.success("Welcome back!");
          onClose();
          window.location.reload();
        } else {
          toast.error(res.message || "Login failed");
        }
      } else {
        const res = await signupAction(formData);
        if (res.success) {
          toast.success("Account created successfully!");
          onClose();
          window.location.reload();
        } else {
          toast.error(res.message || "Registration failed");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-[Playfair_Display]">
              {isLogin ? "Welcome Back" : "Join LabourPulse"}
            </h2>
            <p className="text-gray-500 mt-2 text-sm font-[Inter]">
              {isLogin ? "Sign in to access your personalized news feed" : "Create an account to start your journey with us"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-[Inter]"
                />
              </div>
            )}
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-[Inter]"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-[Inter]"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary font-semibold hover:underline">Forgot password?</button>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-2 font-[Inter] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? "Log In" : "Create Account")}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all font-semibold text-sm text-gray-700">
                <BrandIcons.Google />
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all font-semibold text-sm text-gray-700">
                <BrandIcons.Github />
                GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-bold text-primary hover:underline"
          >
            {isLogin ? "Register Now" : "Login Instead"}
          </button>
        </div>
      </div>
    </div>
  );
}
