import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { Course, Assessment, Material, Score } from '../../types';
import { BookOpen, CheckCircle, Award, Clock, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const TraineeDashboard: React.FC<{ currentView?: string }> = ({ currentView = 'learning' }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Score[]>([]);

  const loadData = () => {
    if (!user) return;
    setCourses(storage.getCourses().filter((c) => c.status === 'published'));
    setScores(storage.getScoresByTrainee(user.id));
    if (selectedCourse) {
      setMaterials(storage.getMaterialsByCourse(selectedCourse.id));
      setAssessments(storage.getAssessmentsByCourse(selectedCourse.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCourse, user]);

  const handleEnroll = (courseId: string) => {
    if (!user) return;
    storage.saveEnrollment({
      id: `enr_${Date.now()}`,
      courseId,
      traineeId: user.id,
      progress: 0,
      status: 'enrolled',
      enrolledAt: new Date().toISOString(),
    });
    loadData();
    alert('Enrolled successfully!');
  };

  const handleQuizSubmit = () => {
    if (!user || !activeQuiz || !selectedCourse) return;
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) correct++;
    });

    const scoreObj: Score = {
      id: `score_${Date.now()}`,
      assessmentId: activeQuiz.id,
      traineeId: user.id,
      score: correct,
      maxScore: activeQuiz.questions.length,
      submittedAt: new Date().toISOString(),
    };
    storage.saveScore(scoreObj);

    const enrollment = storage.getEnrollment(selectedCourse.id, user.id);
    if (enrollment) {
      storage.saveEnrollment({ ...enrollment, progress: 100, status: 'completed' });
    }
    setActiveQuiz(null);
    loadData();
    alert(`Quiz completed! Score: ${correct}/${scoreObj.maxScore}`);
  };

  const enrollments = user ? storage.getEnrollmentsByTrainee(user.id) : [];
  const completed = enrollments.filter((e) => e.status === 'completed');

  const chartData = scores.map((s) => {
    const a = storage.getAssessmentById(s.assessmentId);
    return { name: a?.title || 'Quiz', score: Math.round((s.score / s.maxScore) * 100) };
  });

  return (
    <div className="space-y-6">
      {/* Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900">{activeQuiz.title}</h3>
            <div className="space-y-4">
              {activeQuiz.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200">
                  <p className="font-semibold text-sm mb-3">{idx + 1}. {q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          checked={answers[q.id] === opt.id}
                          onChange={() => setAnswers({ ...answers, [q.id]: opt.id })}
                        />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setActiveQuiz(null)} className="px-4 py-2 text-xs font-bold text-slate-500">
                Cancel
              </button>
              <button onClick={handleQuizSubmit} className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg">
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
              <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover" />
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-[10px] font-bold uppercase text-indigo-600">{course.category}</span>
                <h4 className="font-bold text-slate-900 text-base mt-1">{course.title}</h4>
                <p className="text-xs text-slate-500 mt-2 flex-1">{course.description}</p>
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentView === 'learning' && !selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.map((enr) => {
            const c = storage.getCourseById(enr.courseId);
            if (!c) return null;
            return (
              <div key={enr.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{c.title}</h4>
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-3 mb-1">
                    <span>Progress</span>
                    <span className="font-bold text-indigo-600">{enr.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${enr.progress}%` }} />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(c)}
                  className="mt-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5"
                >
                  Open Study Workspace <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedCourse && (
        <div className="space-y-6">
          <button onClick={() => setSelectedCourse(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800">
            &larr; Back to Enrolled Courses
          </button>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">{selectedCourse.title}</h3>
            <p className="text-sm text-slate-600 mt-2">{selectedCourse.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Syllabus Materials
              </h4>
              <div className="space-y-3">
                {materials.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{m.title}</p>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{m.type}</span>
                    </div>
                    <a href={m.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">
                      Open &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" /> Quizzes & Validations
              </h4>
              <div className="space-y-3">
                {assessments.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{a.title}</p>
                      <span className="text-[10px] text-slate-400">{a.questions.length} questions</span>
                    </div>
                    <button
                      onClick={() => setActiveQuiz(a)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'performance' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6">Quiz Performance Matrix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {currentView === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completed.map((enr) => {
            const c = storage.getCourseById(enr.courseId);
            return (
              <div key={enr.id} className="bg-white p-6 rounded-2xl border border-emerald-200 text-center">
                <Award className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900">{c?.title}</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Official Certificate of Completion</p>
                <button
                  onClick={() => {
                    const w = window.open();
                    w?.document.write(`
                      <div style="text-align:center;padding:50px;font-family:sans-serif;">
                        <h1>Certificate of Capacity Mastery</h1>
                        <p>This recognizes that</p>
                        <h2>${user?.name}</h2>
                        <p>has fulfilled all curriculum competencies for</p>
                        <h3>${c?.title}</h3>
                        <p style="color:#64748b;">Issued on ${new Date().toLocaleDateString()}</p>
                      </div>
                    `);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  View HTML Certificate
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
