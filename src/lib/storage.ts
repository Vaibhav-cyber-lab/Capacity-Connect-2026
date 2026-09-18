import { Assessment, Course, Enrollment, Feedback, Material, Score, User, Evaluation, Announcement, CompetencyMap } from '../types';
import { db } from './firebase';
import { doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';

const STORAGE_KEY = 'capacity_connect_data';

interface AppData {
  users: User[];
  courses: Course[];
  materials: Material[];
  assessments: Assessment[];
  enrollments: Enrollment[];
  scores: Score[];
  feedback: Feedback[];
  evaluations: Evaluation[];
  announcements: Announcement[];
  competencies: CompetencyMap[];
}

const defaultData: AppData = {
  users: [
    {
      id: 'admin_1',
      name: 'System Admin',
      email: 'admin@capacity.com',
      password: 'admin',
      role: 'admin',
      status: 'approved',
      profile: {},
    },
    {
      id: 'trainer_1',
      name: 'Dr. Sarah Connor',
      email: 'trainer@capacity.com',
      password: 'password',
      role: 'trainer',
      status: 'approved',
      profile: { qualifications: 'Senior Staff Architect', skills: 'Leadership, AI Systems, Cloud Engineering' },
    },
    {
      id: 'trainee_1',
      name: 'Alex Rivera',
      email: 'trainee@capacity.com',
      password: 'password',
      role: 'trainee',
      status: 'approved',
      profile: { interests: 'Web Architecture, Machine Learning' },
    },
  ],
  courses: [
    {
      id: 'course_1',
      title: 'Executive Leadership & Strategic Synergy',
      description: 'Master enterprise team orchestration, agile governance, and modern leadership tenets.',
      trainerId: 'trainer_1',
      status: 'published',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600',
      category: 'Management',
      duration: '4 Weeks',
    },
    {
      id: 'course_2',
      title: 'Full-Stack GenAI Application Engineering',
      description: 'Build production-ready, intelligent web systems powered by Gemini and Node microservices.',
      trainerId: 'trainer_1',
      status: 'published',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
      category: 'Technology',
      duration: '6 Weeks',
    },
    {
      id: 'course_3',
      title: 'Corporate Financial Modeling & Valuation',
      description: 'Understand balance sheets, strategic capital allocations, and venture unit economics.',
      trainerId: 'trainer_1',
      status: 'published',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      category: 'Finance',
      duration: '3 Weeks',
    },
  ],
  materials: [
    {
      id: 'mat_1',
      courseId: 'course_1',
      title: 'Foundations of Modern Leadership.pdf',
      type: 'pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: 'mat_2',
      courseId: 'course_2',
      title: 'Full Stack Architecture Masterclass',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  ],
  assessments: [
    {
      id: 'ass_1',
      courseId: 'course_1',
      title: 'Leadership Principles & Decision Matrix',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: [
        {
          id: 'q1',
          text: 'Which leadership style emphasizes delegation, active coaching, and collective consensus?',
          options: [
            { id: 'o1', text: 'Participative / Democratic' },
            { id: 'o2', text: 'Strict Autocratic' },
            { id: 'o3', text: 'Micromanagement' },
          ],
          correctOptionId: 'o1',
        },
        {
          id: 'q2',
          text: 'What is the primary indicator of high team psychological safety?',
          options: [
            { id: 'o1', text: 'Zero dissenting opinions' },
            { id: 'o2', text: 'Vulnerability and openness to discuss errors without fear' },
            { id: 'o3', text: 'Strict punitive escalation policies' },
          ],
          correctOptionId: 'o2',
        },
      ],
    },
  ],
  enrollments: [],
  scores: [],
  feedback: [],
  evaluations: [],
  announcements: [
    {
      id: 'ann_1',
      title: 'Welcome to the New Capacity Connect Workspace',
      message: 'Explore courses, complete assessments, and verify your credentials seamlessly.',
      targetRole: 'all',
      sentAt: new Date().toISOString(),
    },
  ],
  competencies: [
    {
      id: 'comp_1',
      roleTitle: 'Solutions Architect',
      requiredSkills: ['Cloud Infrastructure', 'System Design', 'API Security'],
    },
  ],
};

const getData = (): AppData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    const parsed = JSON.parse(data);
    return { ...defaultData, ...parsed };
  } catch {
    return defaultData;
  }
};

const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('capacity_data_changed'));
  }
};

const setData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  notifyChange();
};

const syncToFirestore = async (collectionName: string, id: string, item: unknown) => {
  try {
    await setDoc(doc(db, collectionName, id), item as Record<string, unknown>);
  } catch (err) {
    console.error(`Error syncing ${collectionName}/${id}:`, err);
  }
};

const deleteFromFirestore = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    console.error(`Error deleting ${collectionName}/${id}:`, err);
  }
};

let syncInitialized = false;

export const storage = {
  init: () => {
    const data = getData();
    storage.startFirebaseSync();
    return data;
  },

  startFirebaseSync: () => {
    if (syncInitialized) return;
    syncInitialized = true;
    const collections = ['users', 'courses', 'materials', 'assessments', 'enrollments', 'scores', 'feedback', 'evaluations', 'announcements', 'competencies'];

    collections.forEach((colName) => {
      onSnapshot(collection(db, colName), (snapshot) => {
        const local = getData();
        let modified = false;

        snapshot.docChanges().forEach((change) => {
          const docId = change.doc.id;
          const docData = change.doc.data();
          const targetArray = (local as Record<string, unknown[]>)[colName] || [];

          if (change.type === 'removed') {
            const idx = targetArray.findIndex((item) => (item as { id: string }).id === docId);
            if (idx >= 0) {
              targetArray.splice(idx, 1);
              modified = true;
            }
          } else {
            const idx = targetArray.findIndex((item) => (item as { id: string }).id === docId);
            if (idx < 0) {
              targetArray.push(docData);
              modified = true;
            } else {
              targetArray[idx] = docData;
              modified = true;
            }
          }
        });

        if (modified) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
          notifyChange();
        }
      });
    });
  },

  getUsers: () => getData().users,
  getUserById: (id: string) => getData().users.find((u) => u.id === id),
  getUserByEmail: (email: string) => getData().users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  saveUser: (user: User) => {
    const data = getData();
    data.users = data.users.filter((u) => u.id !== user.id).concat(user);
    setData(data);
    syncToFirestore('users', user.id, user);
  },
  deleteUser: (id: string) => {
    const data = getData();
    data.users = data.users.filter((u) => u.id !== id);
    setData(data);
    deleteFromFirestore('users', id);
  },

  getCourses: () => getData().courses,
  getCourseById: (id: string) => getData().courses.find((c) => c.id === id),
  getCoursesByTrainer: (trainerId: string) => getData().courses.filter((c) => c.trainerId === trainerId),
  saveCourse: (course: Course) => {
    const data = getData();
    data.courses = data.courses.filter((c) => c.id !== course.id).concat(course);
    setData(data);
    syncToFirestore('courses', course.id, course);
  },
  deleteCourse: (id: string) => {
    const data = getData();
    data.courses = data.courses.filter((c) => c.id !== id);
    setData(data);
    deleteFromFirestore('courses', id);
  },

  getMaterialsByCourse: (courseId: string) => getData().materials.filter((m) => m.courseId === courseId),
  saveMaterial: (material: Material) => {
    const data = getData();
    data.materials.push(material);
    setData(data);
    syncToFirestore('materials', material.id, material);
  },
  deleteMaterial: (id: string) => {
    const data = getData();
    data.materials = data.materials.filter((m) => m.id !== id);
    setData(data);
    deleteFromFirestore('materials', id);
  },

  getAllAssessments: () => getData().assessments,
  getAssessmentsByCourse: (courseId: string) => getData().assessments.filter((a) => a.courseId === courseId),
  getAssessmentById: (id: string) => getData().assessments.find((a) => a.id === id),
  saveAssessment: (assessment: Assessment) => {
    const data = getData();
    data.assessments = data.assessments.filter((a) => a.id !== assessment.id).concat(assessment);
    setData(data);
    syncToFirestore('assessments', assessment.id, assessment);
  },
  deleteAssessment: (id: string) => {
    const data = getData();
    data.assessments = data.assessments.filter((a) => a.id !== id);
    setData(data);
    deleteFromFirestore('assessments', id);
  },

  getAllEnrollments: () => getData().enrollments,
  getEnrollmentsByTrainee: (traineeId: string) => getData().enrollments.filter((e) => e.traineeId === traineeId),
  getEnrollmentsByCourse: (courseId: string) => getData().enrollments.filter((e) => e.courseId === courseId),
  getEnrollment: (courseId: string, traineeId: string) => getData().enrollments.find((e) => e.courseId === courseId && e.traineeId === traineeId),
  saveEnrollment: (enrollment: Enrollment) => {
    const data = getData();
    data.enrollments = data.enrollments.filter((e) => e.id !== enrollment.id).concat(enrollment);
    setData(data);
    syncToFirestore('enrollments', enrollment.id, enrollment);
  },

  getAllScores: () => getData().scores,
  getScoresByTrainee: (traineeId: string) => getData().scores.filter((s) => s.traineeId === traineeId),
  saveScore: (score: Score) => {
    const data = getData();
    data.scores.push(score);
    setData(data);
    syncToFirestore('scores', score.id, score);
  },

  getFeedbackByCourse: (courseId: string) => getData().feedback.filter((f) => f.courseId === courseId),
  saveFeedback: (feedback: Feedback) => {
    const data = getData();
    data.feedback.push(feedback);
    setData(data);
    syncToFirestore('feedback', feedback.id, feedback);
  },

  getEvaluationsByTrainee: (traineeId: string) => getData().evaluations.filter((e) => e.traineeId === traineeId),
  saveEvaluation: (evalObj: Evaluation) => {
    const data = getData();
    data.evaluations.push(evalObj);
    setData(data);
    syncToFirestore('evaluations', evalObj.id, evalObj);
  },

  getAnnouncements: () => getData().announcements,
  saveAnnouncement: (ann: Announcement) => {
    const data = getData();
    data.announcements.push(ann);
    setData(data);
    syncToFirestore('announcements', ann.id, ann);
  },

  getCompetencies: () => getData().competencies,
  saveCompetency: (comp: CompetencyMap) => {
    const data = getData();
    data.competencies = data.competencies.filter((c) => c.id !== comp.id).concat(comp);
    setData(data);
    syncToFirestore('competencies', comp.id, comp);
  },
};
