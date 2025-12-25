
import React from 'react';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm">
      <div className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30 ring-2 ring-red-500/20">
            <span className="text-white text-xl font-extrabold">ST</span>
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <h1 className="text-xs font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight mb-0.5 whitespace-nowrap">
              Spiritual Talk Foundation
            </h1>
            <p className="text-[10px] text-gray-600 leading-tight whitespace-nowrap font-medium">
              Learning Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

