import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { api } from '../../lib/api';
import { Course, Assessment, Material } from '../../types';
import { PlusCircle, Sparkles, BookOpen, Trash2, Upload } from 'lucide-react';

export const TrainerDashboard: React.FC<{ currentView?: string }> = ({ currentView = 'courses' }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // New course form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Technology');
  const [duration, setDuration] = useState('4 Weeks');

  // Materials & assessments modal
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<'pdf' | 'video' | 'link'>('pdf');
  const [matUrl, setMatUrl] = useState('');

  const loadData = () => {
    if (!user) return;
    setCourses(storage.getCoursesByTrainer(user.id));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const course: Course = {
      id: `course_${Date.now()}`,
      title,
      description: desc,
      trainerId: user.id,
      status: 'published',
      createdAt: new Date().toISOString(),
      category,
      duration,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    };
    storage.saveCourse(course);
    setTitle('');
    setDesc('');
    loadData();
    alert('Course published successfully!');
  };

  const handleAiGenerate = async () => {
    if (!title.trim()) {
      alert('Please enter a course title first to assist AI generation.');
      return;
    }
    setIsAiLoading(true);
    try {
      const generated = await api.generateSyllabus({ topic: title, duration });
      setDesc(generated.description);
    } catch {
      alert('Failed to run AI assistance. Falling back to manual editing.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    storage.saveMaterial({
      id: `mat_${Date.now()}`,
      courseId: selectedCourse.id,
      title: matTitle,
      type: matType,
      url: matUrl,
    });
    setMatTitle('');
    setMatUrl('');
    alert('Material saved.');
  };

  return (
    <div className="space-y-8">
      {/* Course Creator Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Publish New Course</h3>
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            {isAiLoading ? 'Synthesizing...' : 'AI Syllabus Assist'}
          </button>
        </div>

        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                required
                placeholder="Course Title (e.g. Distributed Cloud Systems)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-slate-50"
              >
                <option value="Technology">Technology</option>
                <option value="Management">Management</option>
                <option value="Finance">Finance</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>
          <textarea
            required
            rows={3}
            placeholder="Detailed course overview and competencies..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
          />
          <div className="flex justify-end">
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs">
              Save & Publish Course
            </button>
          </div>
        </form>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-indigo-600">{course.category}</span>
              <h4 className="font-bold text-slate-900 text-base mt-1">{course.title}</h4>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{course.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedCourse(course)}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Attach Content
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this course?')) {
                    storage.deleteCourse(course.id);
                    loadData();
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Content Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900">Upload Material for: {selectedCourse.title}</h3>
            <form onSubmit={handleUploadMaterial} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Material Title (e.g. Chapter 1 PDF)"
                value={matTitle}
                onChange={(e) => setMatTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <select
                value={matType}
                onChange={(e) => setMatType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50"
              >
                <option value="pdf">PDF</option>
                <option value="video">Video URL</option>
                <option value="link">Web Document</option>
              </select>
              <input
                type="url"
                required
                placeholder="URL link"
                value={matUrl}
                onChange={(e) => setMatUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSelectedCourse(null)} className="px-4 py-2 text-xs font-bold text-slate-500">
                  Close
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg">
                  Add Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
