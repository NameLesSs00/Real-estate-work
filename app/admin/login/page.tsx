import React from 'react';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-inter overflow-x-hidden">
      {/* Main Container - The "dev" container */}
      <div className="relative w-full max-w-[850px] mx-4 pt-10 pb-20">
        
        {/* The White Circle Shape from Figma (260x260) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] bg-white rounded-full z-20 flex items-end justify-center pb-8">
           <div className="relative w-48 h-20 mb-2">
              <Image 
                src="/admin/login/logo.png" 
                alt="The Gate Estates" 
                fill 
                className="object-contain"
                priority
              />
           </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#16273B] rounded-[50px] pt-40 pb-24 px-16 md:px-32 shadow-2xl relative overflow-hidden">
          {/* Background circle cutout effect to create the "U" shape */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] bg-white rounded-full z-10 shadow-inner"></div>
          
          <form className="space-y-6 mt-4 relative z-20">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-white text-lg font-medium block ml-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center opacity-60">
                  <Image src="/admin/login/username.png" alt="" width={18} height={18} className="object-contain" />
                </div>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="w-full bg-white rounded-xl py-3.5 pl-14 pr-6 text-[#16273B] placeholder-[#D1D5DC] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-inter text-base"
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
                  placeholder="Password"
                  className="w-full bg-white rounded-xl py-3.5 pl-14 pr-6 text-[#16273B] placeholder-[#D1D5DC] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-inter text-base"
                />
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-[2px] bg-white text-[#16273B] font-bold h-[45px] p-2 rounded-[16px] hover:bg-white/95 transition-all text-xl active:scale-[0.99] shadow-lg"
                style={{
                  display: 'flex',
                  height: '45px',
                  padding: '8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '2px',
                  borderRadius: '16px',
                  background: '#FFF'
                }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
