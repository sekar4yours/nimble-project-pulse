
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

export type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthFormsProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

const AuthForms: React.FC<AuthFormsProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup' && password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    // In a real app, these would connect to backend services
    if (mode === 'login') {
      // Mock successful login
      toast.success("Successfully logged in");
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        name: "John Doe",
        email: email,
        initials: "JD"
      }));
      onClose();
      window.location.reload();
    } else if (mode === 'signup') {
      toast.success("Account created successfully");
      setMode('login');
    } else if (mode === 'forgot') {
      toast.success("Password reset link sent to your email");
      setMode('login');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Log in' : mode === 'signup' ? 'Sign up' : 'Reset password'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' ? 'Enter your credentials to access your account' : 
             mode === 'signup' ? 'Create a new account to get started' : 
             'Enter your email to receive a password reset link'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          {mode !== 'forgot' && (
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}
          
          {mode === 'signup' && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full pt-4">
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 mb-4 sm:mb-0">
              {mode === 'login' ? (
                <>
                  <Button type="button" variant="link" onClick={() => setMode('forgot')} className="px-0">
                    Forgot password?
                  </Button>
                  <Button type="button" variant="link" onClick={() => setMode('signup')} className="px-0">
                    Don't have an account?
                  </Button>
                </>
              ) : (
                <Button type="button" variant="link" onClick={() => setMode('login')} className="px-0">
                  {mode === 'signup' ? 'Already have an account?' : 'Back to login'}
                </Button>
              )}
            </div>
            <Button type="submit">
              {mode === 'login' ? 'Log in' : mode === 'signup' ? 'Sign up' : 'Send reset link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthForms;
