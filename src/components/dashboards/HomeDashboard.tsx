import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layout } from '../layout/Layout';
import { TraineeDashboard } from './TraineeDashboard';
import { TrainerDashboard } from './TrainerDashboard';
import { AdminDashboard } from './AdminDashboard';
import {
  LayoutDashboard,
  BookOpen,
  Library,
  BarChart2,
  Award,
  Users,
  Bell,
  Upload,
  CheckCircle,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  return (
    <Layout>
      <div className="flex w-full h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-2">
              Workspace Portal
            </div>

            {user.role === 'trainee' && (
              <>
                <button
                  onClick={() => setActiveTab('learning')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'learning' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Library className="w-4 h-4" /> My Enrolled Courses
                </button>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'catalog' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <BookOpen className="w-4 h-4" /> Course Catalog
                </button>
                <button
                  onClick={() => setActiveTab('performance')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'performance' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <BarChart2 className="w-4 h-4" /> Scorecard Matrix
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'certificates' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Award className="w-4 h-4" /> Certifications
                </button>
              </>
            )}

            {user.role === 'trainer' && (
              <>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'courses' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <BookOpen className="w-4 h-4" /> Courses & Curriculum
                </button>
              </>
            )}

            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Users className="w-4 h-4" /> User Management
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'announcements' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Bell className="w-4 h-4" /> Network Broadcasts
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Dynamic Workspace Container */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {user.role === 'trainee' && <TraineeDashboard currentView={activeTab} />}
            {user.role === 'trainer' && <TrainerDashboard currentView={activeTab} />}
            {user.role === 'admin' && <AdminDashboard currentView={activeTab} />}
          </div>
        </div>
      </div>
    </Layout>
  );
};
