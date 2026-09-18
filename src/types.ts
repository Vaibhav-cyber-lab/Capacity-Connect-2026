export type Role = 'trainee' | 'trainer' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  status: UserStatus;
  createdAt?: string;
  profile: {
    phone?: string;
    qualifications?: string;
    workExperience?: string;
    skills?: string;
    interests?: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  trainerId: string;
  status: 'draft' | 'published';
  createdAt: string;
  thumbnail?: string;
  category?: string;
  duration?: string;
}

export interface Material {
  id: string;
  courseId: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
}

export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  deadline: string;
  questions: Question[];
}

export interface Enrollment {
  id: string;
  courseId: string;
  traineeId: string;
  progress: number;
  status: 'enrolled' | 'completed';
  enrolledAt: string;
}

export interface Score {
  id: string;
  assessmentId: string;
  traineeId: string;
  score: number;
  maxScore: number;
  submittedAt: string;
}

export interface Feedback {
  id: string;
  courseId: string;
  traineeId: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface Evaluation {
  id: string;
  traineeId: string;
  trainerId: string;
  courseId: string;
  competencyScore: number;
  remarks: string;
  evaluatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | 'trainee' | 'trainer';
  sentAt: string;
}

export interface CompetencyMap {
  id: string;
  roleTitle: string;
  requiredSkills: string[];
}
