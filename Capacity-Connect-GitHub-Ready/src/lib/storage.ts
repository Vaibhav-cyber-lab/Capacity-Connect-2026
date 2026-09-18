import { Assessment, Course, Enrollment, Feedback, Material, Score, User, Evaluation, Announcement, CompetencyMap } from '../types';
import { db, isFirebaseConfigured } from './firebase';
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
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      role: 'admin',
      status: 'approved',
      profile: {},
    },
    {
      id: 'trainer_1',
      name: 'John Doe (Trainer)',
      email: 'trainer@capacity.com',
      passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      role: 'trainer',
      status: 'approved',
      profile: { skills: 'Leadership, Management' },
    },
    {
      id: 'trainee_1',
      name: 'Jane Smith (Trainee)',
      email: 'trainee@capacity.com',
      passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      role: 'trainee',
      status: 'approved',
      profile: { interests: 'Leadership' },
    },
  ],
  courses: [
    {
      id: 'course_1',
      title: 'Advanced Leadership Skills',
      description: 'Develop essential leadership skills for modern management and team synergy.',
      trainerId: 'trainer_1',
      status: 'published',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600',
      category: 'Management',
      duration: '4 Weeks',
    },
    {
      id: 'course_2',
      title: 'Full-Stack AI Application Development',
      description: 'Build production-ready web apps powered by Gemini AI and modern TypeScript.',
      trainerId: 'trainer_1',
      status: 'published',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
      category: 'Technology',
      duration: '6 Weeks',
    },
    {
      id: 'course_3',
      title: 'Financial Literacy & Strategic Planning',
      description: 'Master budgeting, risk analysis, and financial decision-making for enterprises.',
      trainerId: 'trainer_1',
      status: 'published',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      category: 'Finance',
      duration: '3 Weeks',
    },
    {
      id: 'course_4',
      title: 'UI/UX Design Masterclass',
      description: 'Design intuitive user interfaces and delightful digital experiences using Figma.',
      trainerId: 'trainer_1',
      status: 'published',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600',
      category: 'Design',
      duration: '5 Weeks',
    },
  ],
  materials: [
    {
      id: 'mat_1',
      courseId: 'course_1',
      title: 'Introduction to Leadership.pdf',
      type: 'pdf',
      url: '#',
    },
  ],
  assessments: [
    {
      id: 'ass_1',
      courseId: 'course_1',
      title: 'Leadership Strategy & Core Competencies Quiz',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: [
        {
          id: 'q1',
          text: 'Which leadership style focuses on high collaboration, consensus, and shared decision-making?',
          options: [
            { id: 'o1', text: 'Democratic / Participative' },
            { id: 'o2', text: 'Autocratic / Authoritative' },
            { id: 'o3', text: 'Laissez-Faire' },
          ],
          correctOptionId: 'o1',
        },
        {
          id: 'q2',
          text: 'What is the primary objective of active listening in team management?',
          options: [
            { id: 'o1', text: 'To reply quickly with an argument' },
            { id: 'o2', text: 'To understand and validate the speaker\'s perspective' },
            { id: 'o3', text: 'To document errors made by the speaker' },
          ],
          correctOptionId: 'o2',
        },
        {
          id: 'q3',
          text: 'Which framework is most effective for setting clear and trackable team goals?',
          options: [
            { id: 'o1', text: 'SMART Goals framework' },
            { id: 'o2', text: 'Ad-hoc task allocation' },
            { id: 'o3', text: 'Reactive problem solving' },
          ],
          correctOptionId: 'o1',
        },
      ],
    },
    {
      id: 'ass_2',
      courseId: 'course_2',
      title: 'Full-Stack AI Application Engineering Quiz',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: [
        {
          id: 'q4',
          text: 'Which Gemini SDK method is used to generate content in a non-streaming manner?',
          options: [
            { id: 'o1', text: 'ai.models.generateContent' },
            { id: 'o2', text: 'ai.models.generateStream' },
            { id: 'o3', text: 'ai.models.chat' },
          ],
          correctOptionId: 'o1',
        },
        {
          id: 'q5',
          text: 'Why should sensitive API keys never be exposed on the browser / client-side?',
          options: [
            { id: 'o1', text: 'To prevent billing theft and unauthorized model access' },
            { id: 'o2', text: 'Because client-side code is faster' },
            { id: 'o3', text: 'Because browsers do not support string types' },
          ],
          correctOptionId: 'o1',
        },
        {
          id: 'q6',
          text: 'What is the primary role of a server-side proxy route in full-stack applications?',
          options: [
            { id: 'o1', text: 'To securely store secrets and forward browser requests to external APIs' },
            { id: 'o2', text: 'To compile CSS stylesheets' },
            { id: 'o3', text: 'To compress video files' },
          ],
          correctOptionId: 'o1',
        },
      ],
    },
    {
      id: 'ass_3',
      courseId: 'course_3',
      title: 'Corporate Finance & Strategic Decisions Quiz',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: [
        {
          id: 'q7',
          text: 'What does ROI stand for in financial management?',
          options: [
            { id: 'o1', text: 'Return on Investment' },
            { id: 'o2', text: 'Risk of Inflation' },
            { id: 'o3', text: 'Rate of Interest' },
          ],
          correctOptionId: 'o1',
        },
        {
          id: 'q8',
          text: 'Which financial statement provides a snapshot of an organization\'s assets, liabilities, and equity?',
          options: [
            { id: 'o1', text: 'Balance Sheet' },
            { id: 'o2', text: 'Income Statement' },
            { id: 'o3', text: 'Cash Flow Statement' },
          ],
          correctOptionId: 'o1',
        },
        {
          id: 'q9',
          text: 'What is the primary purpose of a capital budget?',
          options: [
            { id: 'o1', text: 'To plan and evaluate long-term investments in high-value assets' },
            { id: 'o2', text: 'To pay monthly utility bills' },
            { id: 'o3', text: 'To calculate daily marketing expenses' },
          ],
          correctOptionId: 'o1',
        },
      ],
    },
    {
      id: 'ass_4',
      courseId: 'course_4',
      title: 'User Experience & Interface Design Quiz',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: [
        {
          id: 'q10',
          text: 'What is the primary difference between UI and UX design?',
          options: [
            { id: 'o1', text: 'UI is visual styling, while UX is the logical structure and user journey' },
            { id: 'o2', text: 'UI is for mobile and UX is for desktop' },
            { id: 'o3', text: 'UI is done by engineers and UX is done by managers' },
          ],
          correctOptionId: 'o1',
        },
        {
          id: 'q11',
          text: 'According to UX design principles, what does \'Fitts\'s Law\' describe?',
          options: [
            { id: 'o1', text: 'The time to acquire a target is a function of its distance and size' },
            { id: 'o2', text: 'The total number of font sizes on a screen' },
            { id: 'o3', text: 'The color contrast ratio required for buttons' },
          ],
          correctOptionId: 'o1',
        },
        {
          id: 'q12',
          text: 'Why is a high-contrast ratio crucial for digital user interfaces?',
          options: [
            { id: 'o1', text: 'It ensures high accessibility and legibility for all users' },
            { id: 'o2', text: 'It makes images load faster' },
            { id: 'o3', text: 'It reduces device battery consumption' },
          ],
          correctOptionId: 'o1',
        },
      ],
    },
  ],
  enrollments: [],
  scores: [],
  feedback: [],
  evaluations: [],
  announcements: [],
  competencies: [],
};

// Internal Helper to get/set full data tree
const getData = (): AppData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  const parsed = JSON.parse(data);
  // Backwards compatibility for new arrays if missing
  if (!parsed.users) parsed.users = defaultData.users || [];
  if (!parsed.courses) parsed.courses = [];
  if (!parsed.materials) parsed.materials = [];
  if (!parsed.assessments) parsed.assessments = [];
  if (!parsed.enrollments) parsed.enrollments = [];
  if (!parsed.scores) parsed.scores = [];
  if (!parsed.feedback) parsed.feedback = [];
  if (!parsed.evaluations) parsed.evaluations = [];
  if (!parsed.announcements) parsed.announcements = [];
  if (!parsed.competencies) parsed.competencies = [];

  // Ensure default demo courses exist with thumbnails
  defaultData.courses.forEach(defaultCourse => {
    const existing = parsed.courses.find((c: Course) => c.id === defaultCourse.id);
    if (!existing) {
      parsed.courses.push(defaultCourse);
    } else if (!existing.thumbnail) {
      existing.thumbnail = defaultCourse.thumbnail;
      existing.category = defaultCourse.category;
      existing.duration = defaultCourse.duration;
    }
  });

  // Ensure default assessments (quizzes) exist with updated questions
  defaultData.assessments.forEach(defaultAss => {
    const existing = parsed.assessments.find((a: Assessment) => a.id === defaultAss.id);
    if (!existing) {
      parsed.assessments.push(defaultAss);
    } else {
      // Overwrite/sync latest questions
      existing.questions = defaultAss.questions;
      existing.title = defaultAss.title;
    }
  });

  return parsed;
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

const syncToFirestore = async (collectionName: string, id: string, item: any) => {
  try {
    if (!isFirebaseConfigured || !db) return;\n    await setDoc(doc(db, collectionName, id), item);
  } catch (err) {
    console.error(`Error syncing ${collectionName}/${id} to Firestore:`, err);
  }
};

const deleteFromFirestore = async (collectionName: string, id: string) => {
  try {
    if (!isFirebaseConfigured || !db) return;\n    await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    console.error(`Error deleting ${collectionName}/${id} from Firestore:`, err);
  }
};

let syncStarted = false;

export const storage = {
  init: () => {
    const data = getData();
    storage.startFirebaseSync();
    return data;
  },

  startFirebaseSync: () => {
    if (syncStarted || !isFirebaseConfigured || !db) return;
    syncStarted = true;

    const collections = [
      'users',
      'courses',
      'materials',
      'assessments',
      'enrollments',
      'scores',
      'feedback',
      'evaluations',
      'announcements',
      'competencies'
    ];

    // Seed/Upload existing local storage data to Cloud on startup so that it populates the Firestore database immediately
    try {
      const localData = getData();
      collections.forEach((colName) => {
        const items = (localData as any)[colName] || [];
        items.forEach((item: any) => {
          if (item.id) {
            syncToFirestore(colName, item.id, item);
          }
        });
      });
    } catch (e) {
      console.error('Failed to seed local storage to Firestore:', e);
    }

    // Attach real-time cloud listener to all collections to sync updates across devices instantly
    collections.forEach((colName) => {
      onSnapshot(collection(db!, colName), (snapshot) => {
        const localData = getData();
        let changed = false;

        snapshot.docChanges().forEach((change) => {
          const docId = change.doc.id;
          const docData = change.doc.data();

          if (change.type === 'removed') {
            const index = (localData as any)[colName].findIndex((x: any) => x.id === docId);
            if (index >= 0) {
              (localData as any)[colName].splice(index, 1);
              changed = true;
            }
          } else {
            // added or modified
            const index = (localData as any)[colName].findIndex((x: any) => x.id === docId);
            if (index < 0) {
              (localData as any)[colName].push(docData);
              changed = true;
            } else {
              const itemStringified = JSON.stringify((localData as any)[colName][index]);
              const incomingStringified = JSON.stringify(docData);
              if (itemStringified !== incomingStringified) {
                (localData as any)[colName][index] = docData;
                changed = true;
              }
            }
          }
        });

        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
          notifyChange();
        }
      }, (error) => {
        console.error(`Firestore listener error on ${colName}:`, error);
      });
    });
  },

  // --- Users ---
  getUsers: () => getData().users,
  getUserById: (id: string) => getData().users.find((u) => u.id === id),
  getUserByEmail: (email: string) => getData().users.find((u) => u.email === email),
  saveUser: (user: User) => {
    const data = getData();
    const existing = data.users.findIndex((u) => u.id === user.id);
    if (existing >= 0) {
      data.users[existing] = user;
    } else {
      data.users.push(user);
    }
    setData(data);
    syncToFirestore('users', user.id, user);
  },
  deleteUser: (id: string) => {
    const data = getData();
    data.users = data.users.filter(u => u.id !== id);
    setData(data);
    deleteFromFirestore('users', id);
  },

  // --- Courses ---
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
    data.courses = data.courses.filter(c => c.id !== id);
    setData(data);
    deleteFromFirestore('courses', id);
  },

  // --- Materials ---
  getMaterialsByCourse: (courseId: string) => getData().materials.filter((m) => m.courseId === courseId),
  saveMaterial: (material: Material) => {
    const data = getData();
    data.materials.push(material);
    setData(data);
    syncToFirestore('materials', material.id, material);
  },
  deleteMaterial: (id: string) => {
    const data = getData();
    data.materials = data.materials.filter(m => m.id !== id);
    setData(data);
    deleteFromFirestore('materials', id);
  },

  // --- Assessments ---
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
    data.assessments = data.assessments.filter(a => a.id !== id);
    setData(data);
    deleteFromFirestore('assessments', id);
  },

  // --- Enrollments ---
  getAllEnrollments: () => getData().enrollments,
  getEnrollmentsByTrainee: (traineeId: string) => getData().enrollments.filter((e) => e.traineeId === traineeId),
  getEnrollmentsByCourse: (courseId: string) => getData().enrollments.filter((e) => e.courseId === courseId),
  getEnrollment: (courseId: string, traineeId: string) => 
    getData().enrollments.find((e) => e.courseId === courseId && e.traineeId === traineeId),
  saveEnrollment: (enrollment: Enrollment) => {
    const data = getData();
    data.enrollments = data.enrollments.filter((e) => e.id !== enrollment.id).concat(enrollment);
    setData(data);
    syncToFirestore('enrollments', enrollment.id, enrollment);
  },

  // --- Scores ---
  getAllScores: () => getData().scores,
  getScoresByTrainee: (traineeId: string) => getData().scores.filter((s) => s.traineeId === traineeId),
  getScoresByAssessment: (assessmentId: string) => getData().scores.filter((s) => s.assessmentId === assessmentId),
  saveScore: (score: Score) => {
    const data = getData();
    data.scores.push(score);
    setData(data);
    syncToFirestore('scores', score.id, score);
  },

  // --- Feedback ---
  getFeedbackByCourse: (courseId: string) => getData().feedback.filter((f) => f.courseId === courseId),
  saveFeedback: (feedback: Feedback) => {
    const data = getData();
    data.feedback.push(feedback);
    setData(data);
    syncToFirestore('feedback', feedback.id, feedback);
  },

  // --- Evaluations ---
  getEvaluationsByTrainee: (traineeId: string) => getData().evaluations.filter(e => e.traineeId === traineeId),
  saveEvaluation: (evalObj: Evaluation) => {
    const data = getData();
    data.evaluations.push(evalObj);
    setData(data);
    syncToFirestore('evaluations', evalObj.id, evalObj);
  },

  // --- Announcements ---
  getAnnouncements: () => getData().announcements,
  saveAnnouncement: (ann: Announcement) => {
    const data = getData();
    data.announcements.push(ann);
    setData(data);
    syncToFirestore('announcements', ann.id, ann);
  },

  // --- Competencies ---
  getCompetencies: () => getData().competencies,
  saveCompetency: (comp: CompetencyMap) => {
    const data = getData();
    data.competencies = data.competencies.filter(c => c.id !== comp.id).concat(comp);
    setData(data);
    syncToFirestore('competencies', comp.id, comp);
  }
};
