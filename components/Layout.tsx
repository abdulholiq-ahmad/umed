import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-full bg-slate-100 flex justify-center items-start overflow-hidden">
      {/* Mobile container constraint - Simulating a specialized medical device or premium app feel */}
      <div className="w-full max-w-md h-full bg-surface sm:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col sm:my-4 sm:h-[calc(100dvh-2rem)] sm:border-[8px] sm:border-slate-900">
        {/* Status Bar Area (Visual only for web) */}
        <div className="h-safe-top w-full bg-white/0 absolute top-0 z-50 pointer-events-none"></div>
        
        {children}
        
        {/* Home Indicator Safe Area */}
        <div className="h-safe-bottom w-full bg-white/0 absolute bottom-0 z-50 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Layout;