'use client';

import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const SignInAuthButton = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignIn, setIsSignIn] = useState(false)

  const handleGoogleAuth = async () => {
    try {
      setIsSignIn(true);
      const result = await signIn("google");
      if (result?.ok) {
        router.push('/');
        toast.success('Welcome back! You have successfully signed in.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        console.error("Google Sign-In Error:", result?.error);
      }
    } finally {
      setIsSignIn(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password
      });
      if (result?.ok) {
        router.push('/');
        toast.success('Welcome back! You have successfully signed in.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        setError(result?.error)
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate password strength
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[a-z]+/)) score++;
    if (pass.match(/[A-Z]+/)) score++;
    if (pass.match(/[0-9]+/)) score++;
    if (pass.match(/[!@#$%^&*(),.?\":{}|<>]+/)) score++;
    return score;
  };

  // Update password score when password changes
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordScore(calculatePasswordStrength(newPassword));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post('/api/sign-up', {
        fullName,
        email,
        password
      });
      if (response?.status === 200) {
        const result = await signIn('credentials', {
          redirect: false,
          email: email,
          password: password
        });
        if (result?.ok) {
          router.push('/');
          toast.success('Welcome back! You have successfully signed in.', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        } else {
          setError(result?.error)
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className='px-5 py-2.5 max-md:px-4 max-md:py-2 bg-[#1db954] hover:bg-[#1ed760] rounded-full text-black font-medium text-sm flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-[#1db954]/20 cursor-pointer'
        >
          {
            isSignIn ? (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.018.599-1.558.3z" />
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 "
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.018.599-1.558.3z" />
                </svg>
                Connect Spotify
              </>
            )
          }

        </button>
      </DialogTrigger >
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Welcome to Spotify</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
            <TabsTrigger value="signin" className="text-white cursor-pointer">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="text-white cursor-pointer">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-4">
            <Button
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full bg-white text-white cursor-pointer hover:bg-gray-100 h-11"
            >
              {
                isSignIn ? (
                  <span className="flex items-center justify-center w-full">
                    <span className="inline-block w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                    <span className="text-green-500 font-semibold">Signing in...</span>
                  </span>
                ) : (" Continue with Google")
              }
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-400">Or continue with</span>
              </div>
            </div>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-start">
                  <Label htmlFor="password" className="text-white">Password</Label>
                </div>
                <div className='relative group'>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-green-500 text-white cursor-pointer hover:bg-green-600 transition-colors h-11" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <Button
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full bg-white text-white cursor-pointer hover:bg-gray-100 h-11"
            >
              {
                isSignIn ? (
                  <span className="flex items-center justify-center w-full">
                    <span className="inline-block w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                    <span className="text-green-500 font-semibold">Signing in...</span>
                  </span>
                ) : (" Continue with Google")
              }
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-400">Or sign up with email</span>
              </div>
            </div>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">FullName</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="john doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signup-password" className="text-white text-sm font-medium">Password</Label>
                    {password.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${passwordScore >= 4 ? 'bg-green-500' :
                          passwordScore >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        <span className={`text-xs font-medium ${passwordScore >= 4 ? 'text-green-500' :
                          passwordScore >= 2 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                          {passwordScore >= 4 ? 'Strong' : passwordScore >= 2 ? 'Medium' : 'Weak'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      className={`bg-zinc-800 border-zinc-700 text-white pr-10 transition-all duration-200
                        focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 ${passwordScore >= 4 ? 'focus:ring-green-500/50' :
                          passwordScore >= 2 ? 'focus:ring-yellow-500/50' : 'focus:ring-red-500/50'
                        }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= passwordScore
                              ? passwordScore >= 4
                                ? 'bg-green-500'
                                : passwordScore >= 2
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              : 'bg-zinc-800'
                              }`}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${password.length >= 8 ? 'bg-green-500/10' : 'bg-zinc-800/50'
                          }`}>
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full ${password.length >= 8 ? 'bg-green-500 text-white' : 'bg-zinc-700 text-zinc-500'
                            }`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              {password.length >= 8 ? (
                                <path d="M20 6L9 17l-5-5" />
                              ) : (
                                <path d="M18 6L6 18M6 6l12 12" />
                              )}
                            </svg>
                          </div>
                          <span className={`text-xs font-medium ${password.length >= 8 ? 'text-white' : 'text-zinc-400'}`}>
                            8+ characters
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${/[A-Z]/.test(password) ? 'bg-green-500/10' : 'bg-zinc-800/50'
                          }`}>
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500 text-white' : 'bg-zinc-700 text-zinc-500'
                            }`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              {/[A-Z]/.test(password) ? (
                                <path d="M20 6L9 17l-5-5" />
                              ) : (
                                <path d="M18 6L6 18M6 6l12 12" />
                              )}
                            </svg>
                          </div>
                          <span className={`text-xs font-medium ${/[A-Z]/.test(password) ? 'text-white' : 'text-zinc-400'}`}>
                            Uppercase
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${/[0-9]/.test(password) ? 'bg-green-500/10' : 'bg-zinc-800/50'
                          }`}>
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500 text-white' : 'bg-zinc-700 text-zinc-500'
                            }`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              {/[0-9]/.test(password) ? (
                                <path d="M20 6L9 17l-5-5" />
                              ) : (
                                <path d="M18 6L6 18M6 6l12 12" />
                              )}
                            </svg>
                          </div>
                          <span className={`text-xs font-medium ${/[0-9]/.test(password) ? 'text-white' : 'text-zinc-400'}`}>
                            Number
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${/[!@#$%^&*(),.?\":{}|<>]/.test(password) ? 'bg-green-500/10' : 'bg-zinc-800/50'
                          }`}>
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full ${/[!@#$%^&*(),.?\":{}|<>]/.test(password) ? 'bg-green-500 text-white' : 'bg-zinc-700 text-zinc-500'
                            }`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              {/[!@#$%^&*(),.?\":{}|<>]/.test(password) ? (
                                <path d="M20 6L9 17l-5-5" />
                              ) : (
                                <path d="M18 6L6 18M6 6l12 12" />
                              )}
                            </svg>
                          </div>
                          <span className={`text-xs font-medium ${/[!@#$%^&*(),.?\":{}|<>]/.test(password) ? 'text-white' : 'text-zinc-400'}`}>
                            Special char
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 cursor-pointer text-white transition-colors h-11" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog >
  );
};

export default SignInAuthButton;