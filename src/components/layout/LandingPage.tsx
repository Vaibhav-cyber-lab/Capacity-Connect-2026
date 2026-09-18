import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { storage } from '../../lib/storage';
import { ArrowRight, CheckCircle2, ShieldCheck, GraduationCap, Users } from 'lucide-react';

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const courses = storage.getCourses().filter((c) => c.status === 'published');
  const users = storage.getUsers();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onSignInClick={onGetStarted} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 bg-radial from-indigo-50/50 to-transparent">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 mb-6">
              Empowerment &bull; Verification &bull; Growth
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Enterprise Capacity Building <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                Engineered for High-Performers
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Access curated curricula, take auto-graded competency evaluations, and earn authenticated completion certificates in a unified digital workspace.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
              >
                Access Learning Hub <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Metric Counter */}
        <section className="bg-slate-900 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-indigo-400">{users.filter((u) => u.role === 'trainee').length}</p>
              <p className="text-xs uppercase text-slate-400 mt-1">Active Trainees</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-400">{users.filter((u) => u.role === 'trainer').length}</p>
              <p className="text-xs uppercase text-slate-400 mt-1">Certified Trainers</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-400">{courses.length}</p>
              <p className="text-xs uppercase text-slate-400 mt-1">Published Programs</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-amber-400">100%</p>
              <p className="text-xs uppercase text-slate-400 mt-1">Verified Diplomas</p>
            </div>
          </div>
        </section>

        {/* Role Matrix */}
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Tailored For Every Role</h2>
            <p className="text-slate-600 mt-2">Specialized tooling ensuring productive outcomes for candidates, instructors, and executives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">For Trainees</h3>
              <p className="text-sm text-slate-600 mb-4">Enroll in vetted courses, take timed quizzes, and print compliant HTML certificates.</p>
              <ul className="text-xs font-semibold text-slate-700 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-timed knowledge checks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time performance telemetry</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">For Trainers</h3>
              <p className="text-sm text-slate-600 mb-4">Publish lectures, attach multimedia, design dynamic quizzes, and assess student competencies.</p>
              <ul className="text-xs font-semibold text-slate-700 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI-assisted syllabus drafting</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Trainee competency scoring matrix</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">For Admins</h3>
              <p className="text-sm text-slate-600 mb-4">Maintain complete oversight of platform security, user rosters, system broadcasts, and certifications.</p>
              <ul className="text-xs font-semibold text-slate-700 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Account management & user audits</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Global notification broadcasts</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
