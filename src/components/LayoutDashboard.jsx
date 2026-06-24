import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Bell } from 'lucide-react';
import { mockUser } from '../data/mockUser';

export function LayoutDashboard({ children }) {
  return (
    <div className="flex h-[100dvh] bg-[#0a0a0a] overflow-hidden w-full">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* App Header */}
        <header className="flex h-14 md:h-16 items-center justify-between px-4 sm:px-6 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md z-10 shrink-0">
          
          <div className="flex items-center gap-2 md:hidden">
             {/* Simple brand for mobile header if needed, or leave it cleaner */}
             <span className="text-lg font-bold text-white">Impulse</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2 text-[#888] hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 md:pl-4 md:border-l border-white/10">
              <div className="text-sm text-right hidden sm:block">
                <p className="font-medium text-white">{mockUser.name}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black font-bold text-sm">
                {mockUser.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        
        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 p-4 sm:p-6 lg:p-8 overscroll-none">
          <div className="mx-auto max-w-5xl min-h-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
