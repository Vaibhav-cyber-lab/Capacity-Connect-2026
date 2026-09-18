import React, { useState } from 'react';
import { storage } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { ArrowLeft, BookOpen, KeyRound, Mail, User as UserIcon } from 'lucide-react';

export const AuthScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('trainee');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const existing = storage.getUserByEmail(email);
      if (existing && existing.password === password) {
        login(existing);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (storage.getUserByEmail(email)) {
        setError('This email address is already registered.');
        return;
      }
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        role,
        status: 'approved' as const,
        createdAt: new Date().toISOString(),
        profile: {},
      };
      storage.saveUser(newUser);
      login(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <button
          onClick={onBack}
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </button>
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-black text-slate-900 tracking-tight">
          {isLogin ? 'Sign in to Capacity Connect' : 'Create your portal account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg border border-rose-200">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Intended Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-medium"
                >
                  <option value="trainee">Trainee (Learn & Certify)</option>
                  <option value="trainer">Trainer (Teach & Evaluate)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-100 transition text-sm"
            >
              {isLogin ? 'Sign In' : 'Register Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already registered? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
