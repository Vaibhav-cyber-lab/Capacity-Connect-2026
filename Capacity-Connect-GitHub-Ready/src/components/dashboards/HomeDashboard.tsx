import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { 
  Home, BookOpen, Library, CheckSquare, BarChart2, Award, 
  User as UserIcon, Bell, MessageSquare, LogOut, 
  ArrowRight, Users, Settings, PlayCircle, PlusCircle, Upload, Book, Target, LayoutDashboard, RotateCw, CheckCircle2, Menu, X
} from 'lucide-react';

import { AdminDashboard } from './AdminDashboard';
import { TrainerDashboard } from './TrainerDashboard';
import { TraineeDashboard } from './TraineeDashboard';

export const HomeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<string>('home');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleDataChange = () => {
      setTick(t => t + 1);
    };

    window.addEventListener('capacity_data_changed', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('capacity_data_changed', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);

  if (!user) return null;

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshToast(true);
    // Force storage re-read
    storage.init();
    window.dispatchEvent(new CustomEvent('capacity_data_changed'));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
    setTimeout(() => {
      setRefreshToast(false);
    }, 3000);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setIsSidebarOpen(false); // Auto-close sidebar on mobile view selection
  };

  // Stats fetching from local storage for the summary cards
  const courses = storage.getCourses();
  const enrollments = storage.getEnrollmentsByTrainee(user.id);
  const assessments = storage.getAllAssessments();
  const announcements = storage.getAnnouncements();
  
  // Dynamic metrics based on role
  const activeCoursesCount = user.role === 'admin' 
    ? courses.length 
    : user.role === 'trainer' 
      ? courses.filter(c => c.trainerId === user.id).length
      : enrollments.filter(e => e.status === 'enrolled').length;

  const pendingAssessmentsCount = assessments.length;
  const notificationsCount = announcements.length;

  // Role specific sidebars
  const renderSidebarLinks = () => {
    if (user.role === 'admin') {
      return (
        <>
          <button onClick={() => handleViewChange('home')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'home' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5 mr-3 text-current" /> Home Dashboard
          </button>
          <button onClick={() => handleViewChange('users')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'users' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Users className="w-5 h-5 mr-3 text-current" /> User Management
          </button>
          <button onClick={() => handleViewChange('courses')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'courses' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <BookOpen className="w-5 h-5 mr-3 text-current" /> Course Monitor
          </button>
          <button onClick={() => handleViewChange('certificates')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'certificates' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Award className="w-5 h-5 mr-3 text-current" /> Certifications
          </button>
          <button onClick={() => handleViewChange('announcements')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'announcements' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Bell className="w-5 h-5 mr-3 text-current" /> Announcements
          </button>
          <button onClick={() => handleViewChange('advanced')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'advanced' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Target className="w-5 h-5 mr-3 text-current" /> Advanced Ops
          </button>
        </>
      );
    }
    
    if (user.role === 'trainer') {
      return (
        <>
          <button onClick={() => handleViewChange('home')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'home' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Home className="w-5 h-5 mr-3 text-current" /> Home Dashboard
          </button>
          <button onClick={() => handleViewChange('profile')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <UserIcon className="w-5 h-5 mr-3 text-current" /> My Profile
          </button>
          <button onClick={() => handleViewChange('courses')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'courses' || activeView === 'course_detail' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <BookOpen className="w-5 h-5 mr-3 text-current" /> Course Management
          </button>
          <button onClick={() => handleViewChange('assessments')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'assessments' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <CheckSquare className="w-5 h-5 mr-3 text-current" /> Quizzes & Questions
          </button>
          <button onClick={() => handleViewChange('monitor')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'monitor' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Users className="w-5 h-5 mr-3 text-current" /> Trainee Monitoring
          </button>
          <button onClick={() => handleViewChange('feedback')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'feedback' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <MessageSquare className="w-5 h-5 mr-3 text-current" /> Course Feedback
          </button>
        </>
      );
    }

    // Default Trainee
    return (
      <>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Main Menu</div>
        <button onClick={() => handleViewChange('home')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'home' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
          <Home className="w-5 h-5 mr-3 text-current" /> Home Dashboard
        </button>
        <button onClick={() => handleViewChange('catalog')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'catalog' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
          <BookOpen className="w-5 h-5 mr-3 text-current" /> Course Catalog
        </button>
        <button onClick={() => handleViewChange('learning')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'learning' || activeView === 'learning_course' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
          <Library className="w-5 h-5 mr-3 text-current" /> My Learning
        </button>
        <button onClick={() => handleViewChange('performance')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'performance' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
          <BarChart2 className="w-5 h-5 mr-3 text-current" /> My Performance
        </button>
        <button onClick={() => handleViewChange('certificates')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'certificates' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
          <Award className="w-5 h-5 mr-3 text-current" /> Certificates
        </button>
        
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-2 px-3">Account</div>
        <button onClick={() => handleViewChange('profile')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
          <UserIcon className="w-5 h-5 mr-3 text-current" /> Profile
        </button>
        <button onClick={() => handleViewChange('feedback')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'feedback' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
          <MessageSquare className="w-5 h-5 mr-3 text-current" /> Feedback
        </button>
      </>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      
      {/* Mobile Sidebar overlay backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Responsive Left Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out z-40 shrink-0
        md:static md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Library className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold tracking-wider text-sm">CAPACITY CONNECT</span>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg md:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {renderSidebarLinks()}
          </nav>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shadow-sm shrink-0 z-10 w-full">
          <div className="flex items-center space-x-3">
             {/* Menu hamburger toggle on mobile screens */}
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 -ml-2 text-gray-500 hover:text-gray-950 rounded-lg hover:bg-gray-100 md:hidden transition-colors"
               title="Open Menu"
             >
               <Menu className="w-6 h-6" />
             </button>
             <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
               {user.role}
             </span>
             {refreshToast && (
               <span className="hidden sm:flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200 animate-in fade-in duration-200">
                 <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Refreshed!
               </span>
             )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Refresh Data Button */}
            <button 
              onClick={handleManualRefresh} 
              disabled={isRefreshing}
              className="flex items-center px-2.5 py-1.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-700 rounded-lg text-xs font-bold transition-all border border-gray-200 active:scale-95 disabled:opacity-50"
              title="Refresh all data"
            >
              <RotateCw className={`w-3.5 h-3.5 sm:mr-1.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button className="relative text-gray-500 hover:text-blue-600 transition-colors p-1.5 rounded-full hover:bg-gray-50">
              <Bell className="w-5 h-5" />
              {notificationsCount > 0 && <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">{notificationsCount}</span>}
            </button>
            
            <div className="flex items-center pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold mr-2 shadow-sm shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col mr-3">
                <span className="text-xs font-bold text-gray-900 leading-tight">{user.name}</span>
                <span className="text-[10px] text-gray-400 font-medium">{user.email}</span>
              </div>
              <button onClick={logout} className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors" title="Log out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50/50">
          
          <div className={activeView === 'home' ? 'block' : 'hidden'}>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.7,-18.1,95.5,-3.3C94.3,11.5,86,25.8,76.4,38.8C66.8,51.8,55.9,63.5,43.2,71.7C30.5,79.9,16,84.6,0.9,83.1C-14.2,81.6,-29.4,73.9,-42.6,65.1C-55.8,56.3,-67,46.4,-75.7,33.9C-84.4,21.4,-90.6,6.3,-89.1,-8.2C-87.6,-22.7,-78.4,-36.6,-67.6,-47.9C-56.8,-59.2,-44.4,-67.9,-30.9,-73.9C-17.4,-79.9,-2.8,-83.2,11.2,-80.6C25.2,-78,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" /></svg>
              </div>
              <div className="relative z-10">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                <p className="text-blue-100 max-w-2xl text-sm sm:text-lg">
                  {user.role === 'admin' && "Here's what's happening across the Capacity Connect platform today."}
                  {user.role === 'trainer' && "Ready to share your knowledge? Track your courses and trainee progress."}
                  {user.role === 'trainee' && "Continue your learning journey. Pick up right where you left off."}
                </p>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-150 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <BookOpen className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {user.role === 'trainee' ? 'Enrolled Courses' : 'Active Courses'}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{activeCoursesCount}</h3>
              </div>
              
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-150 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <CheckSquare className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Pending Assessments</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{pendingAssessmentsCount}</h3>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-150 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Bell className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Recent Notifications</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{notificationsCount}</h3>
              </div>
            </div>

            {/* Role-Based Quick Links / Flow */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {user.role === 'trainee' && (
                <>
                  <QuickCard icon={<Book className="w-6 h-6"/>} title="Browse Courses" desc="Find new skills to learn" onClick={() => handleViewChange('catalog')} color="blue" />
                  <QuickCard icon={<PlayCircle className="w-6 h-6"/>} title="Continue Learning" desc="Jump back into modules" onClick={() => handleViewChange('learning')} color="indigo" />
                  <QuickCard icon={<CheckSquare className="w-6 h-6"/>} title="Take Assessment" desc="Test your knowledge" onClick={() => handleViewChange('learning')} color="purple" />
                  <QuickCard icon={<Award className="w-6 h-6"/>} title="My Certificates" desc="View your achievements" onClick={() => handleViewChange('certificates')} color="amber" />
                </>
              )}

              {user.role === 'trainer' && (
                <>
                  <QuickCard icon={<PlusCircle className="w-6 h-6"/>} title="Create Course" desc="Draft a new syllabus" onClick={() => handleViewChange('courses')} color="blue" />
                  <QuickCard icon={<Upload className="w-6 h-6"/>} title="Upload Materials" desc="Add PDFs & Videos" onClick={() => handleViewChange('courses')} color="indigo" />
                  <QuickCard icon={<Users className="w-6 h-6"/>} title="Monitor Trainees" desc="Review progress & evaluate" onClick={() => handleViewChange('monitor')} color="emerald" />
                  <QuickCard icon={<BarChart2 className="w-6 h-6"/>} title="Course Performance" desc="Analytics and Feedback" onClick={() => handleViewChange('feedback')} color="amber" />
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <QuickCard icon={<Users className="w-6 h-6"/>} title="Manage Users" desc="Approve & assign roles" onClick={() => handleViewChange('users')} color="blue" />
                  <QuickCard icon={<BookOpen className="w-6 h-6"/>} title="Course Directory" desc="Oversight of all content" onClick={() => handleViewChange('courses')} color="indigo" />
                  <QuickCard icon={<Award className="w-6 h-6"/>} title="Certifications" desc="Track issued credentials" onClick={() => handleViewChange('certificates')} color="amber" />
                  <QuickCard icon={<Settings className="w-6 h-6"/>} title="Advanced Ops" desc="Competency mapping" onClick={() => handleViewChange('advanced')} color="slate" />
                </>
              )}
            </div>
          </div>

          <div className={activeView !== 'home' ? 'block' : 'hidden'}>
            {user.role === 'admin' && <AdminDashboard currentView={activeView} />}
            {user.role === 'trainer' && <TrainerDashboard currentView={activeView} />}
            {user.role === 'trainee' && <TraineeDashboard currentView={activeView} />}
          </div>

        </main>
      </div>
    </div>
  );
};

const QuickCard = ({ icon, title, desc, onClick, color }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, color: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300 hover:shadow-blue-500/10',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300 hover:shadow-indigo-500/10',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300 hover:shadow-purple-500/10',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300 hover:shadow-amber-500/10',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-500/10',
    slate: 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300 hover:shadow-slate-500/10',
  };

  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl p-5 border shadow-sm transition-all duration-300 bg-white hover:-translate-y-1 ${colorMap[color].replace(/bg-[a-z]+-50/, 'hover:border-current hover:shadow-lg')}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colorMap[color].split(' ').slice(0,2).join(' ')}`}>
        {icon}
      </div>
      <h4 className="font-bold text-slate-900 mb-1 flex items-center text-sm sm:text-base">
        {title} <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-current" />
      </h4>
      <p className="text-xs font-medium text-slate-500">{desc}</p>
    </div>
  );
};
