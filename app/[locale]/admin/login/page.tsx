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
    <div className="min-h-screen flex items-center justify-center bg-[#E3F2FD] font-inter overflow-x-hidden p-6">
      {/* Login Card */}
      <div className="bg-white rounded-3xl w-full max-w-[500px] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative">
        
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image 
            src="/assists/header/headerLogo.png" 
            alt="Luxe Estate" 
            width={120} 
            height={120}
            className="object-contain brightness-0"
            priority
          />
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[#000000] mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700 text-sm font-semibold block ml-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-5 text-[#000000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-[#2196F3] focus:bg-white transition-all font-inter text-base"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-700 text-sm font-semibold block ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-5 text-[#000000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-[#2196F3] focus:bg-white transition-all font-inter text-base"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm ml-1 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
          )}

          {/* Login Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-[#000000] text-white font-bold h-[54px] rounded-xl transition-all duration-300 hover:bg-[#2196F3] hover:shadow-lg hover:-translate-y-0.5 text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#000000] disabled:hover:-translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
