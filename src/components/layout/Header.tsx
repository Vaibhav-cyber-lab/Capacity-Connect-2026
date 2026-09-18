import React from 'react';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC<{ onSignInClick?: () => void }> = ({ onSignInClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            CAPACITY<span className="text-indigo-600">CONNECT</span>
          </span>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-700">{user.name}</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={onSignInClick}
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
            >
              Sign In
            </button>
            <button
              onClick={onSignInClick}
              className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 transition"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
