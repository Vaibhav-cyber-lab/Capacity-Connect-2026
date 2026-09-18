import React, { useState, useEffect } from 'react';
import { storage } from '../../lib/storage';
import { User, Course, Announcement, Role } from '../../types';
import { Users, BookOpen, ShieldAlert, Award, Bell, UserPlus, Trash2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const AdminDashboard: React.FC<{ currentView?: string }> = ({ currentView = 'users' }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // New user form modal
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('trainee');

  // Broadcast form
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');

  const loadData = () => {
    setUsers(storage.getUsers());
    setCourses(storage.getCourses());
    setAnnouncements(storage.getAnnouncements());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (storage.getUserByEmail(newUserEmail)) {
      alert('User with this email already exists.');
      return;
    }
    storage.saveUser({
      id: `user_${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      status: 'approved',
      createdAt: new Date().toISOString(),
      profile: {},
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setShowAddUser(false);
    loadData();
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveAnnouncement({
      id: `ann_${Date.now()}`,
      title: annTitle,
      message: annMessage,
      targetRole: 'all',
      sentAt: new Date().toISOString(),
    });
    setAnnTitle('');
    setAnnMessage('');
    loadData();
    alert('System announcement dispatched.');
  };

  const roleStats = [
    { name: 'Trainees', value: users.filter((u) => u.role === 'trainee').length, color: '#3b82f6' },
    { name: 'Trainers', value: users.filter((u) => u.role === 'trainer').length, color: '#10b981' },
    { name: 'Admins', value: users.filter((u) => u.role === 'admin').length, color: '#6366f1' },
  ];

  return (
    <div className="space-y-8">
      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900">Add Platform User</h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as Role)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
              >
                <option value="trainee">Trainee</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddUser(false)} className="px-4 py-2 text-xs font-bold text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg">
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentView === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-lg">System Users Roster</h3>
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              <UserPlus className="w-4 h-4" /> Add User
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 uppercase font-bold text-[10px]">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove user ${u.name}?`)) {
                            storage.deleteUser(u.id);
                            loadData();
                          }
                        }}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentView === 'announcements' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Send System Broadcast</h3>
            <form onSubmit={handleBroadcast} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Announcement Title"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <textarea
                required
                rows={3}
                placeholder="Broadcast details to all network members..."
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                Broadcast Now
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900 text-sm">{a.title}</p>
                <p className="text-xs text-slate-600 mt-1">{a.message}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Dispatched: {new Date(a.sentAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
