'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';
import { saveTokens } from '@/lib/auth/tokens';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const tokens = await login({ email, password });

      // Persist tokens in cookies so the middleware can read them
      saveTokens(tokens.accessToken, tokens.refreshToken);
      
      // Persist user info for profile pre-filling
      localStorage.setItem('adminEmail', tokens.email);
      localStorage.setItem('adminName', tokens.fullName);

      // Navigate to dashboard on success
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('[Login] Authentication error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-inter overflow-x-hidden">
      {/* Main Container */}
      <div className="relative w-full max-w-[850px] mx-4 pt-10 pb-20">
        
        {/* The Single White Circle Shape (260x260) */}
        <div className="absolute top-[-125px] left-1/2 -translate-x-1/2 w-[260px] h-[260px] bg-white rounded-full z-20 flex items-center justify-center overflow-hidden shadow-sm">
           <div className="relative w-full h-full">
              <Image 
                src="/admin/login/logo.jpeg" 
                alt="Winners Realty" 
                fill 
                className="object-cover rounded-full"
                priority
              />
           </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#16273B] rounded-[50px] pt-40 pb-24 px-16 md:px-32 shadow-2xl relative">
          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-4 relative z-20">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white text-lg font-medium block ml-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center opacity-60">
                  <Image src="/admin/login/username.png" alt="" width={18} height={18} className="object-contain" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white rounded-xl py-3.5 pl-14 pr-6 text-[#16273B] placeholder-[#D1D5DC] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-inter text-base"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-white text-lg font-medium block ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center opacity-60">
                  <Image src="/admin/login/password.png" alt="" width={18} height={18} className="object-contain" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white rounded-xl py-3.5 pl-14 pr-6 text-[#16273B] placeholder-[#D1D5DC] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-inter text-base"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-sm ml-1 animate-pulse">{error}</p>
            )}

            {/* Login Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-[2px] bg-white text-[#16273B] font-bold h-[45px] p-2 rounded-[16px] transition-all duration-300 hover:bg-[#f8f8f8] hover:scale-[1.02] active:scale-[0.97] active:bg-[#eeeeee] shadow-lg text-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
