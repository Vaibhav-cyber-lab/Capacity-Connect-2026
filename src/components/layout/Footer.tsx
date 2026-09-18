import React from 'react';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3 text-white">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span className="font-bold tracking-tight">Capacity Connect</span>
        </div>
        <p className="text-center md:text-left text-xs">
          Empowering enterprise learning, competency accreditation, and certified career progressions.
        </p>
        <p className="text-xs">&copy; {new Date().getFullYear()} Capacity Connect. All rights reserved.</p>
      </div>
    </footer>
  );
};
