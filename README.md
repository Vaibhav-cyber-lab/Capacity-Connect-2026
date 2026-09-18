# Capacity Connect

A role-based training and capacity management web application built with React, TypeScript, Vite, and Firebase. The platform provides streamlined access control and specialized workflows for Admins, Trainers, and Trainees.

---

## Features

- **Role-Based Access Control (RBAC):** Dedicated views and permissions for Admins, Trainers, and Trainees.
- **Authentication:** Firebase Auth-backed sign-in and session persistence managed through `AuthContext`.
- **Admin Dashboard:** Platform metrics, program administration, and user management.
- **Trainer Dashboard:** Manage training cohorts, assign learning modules, and monitor performance.
- **Trainee Dashboard:** Access assigned modules, submit work, and track individual progress.
- **File Management:** Cloud uploads and document handling via Firebase Storage.
- **Automated Deployment:** GitHub Actions CI/CD pipeline configuration (`.github/workflows/deploy.yml`).

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS / CSS Modules (`src/index.css`)
- **Backend Services:** Firebase Authentication, Cloud Firestore, Firebase Storage
- **Deployment:** GitHub Actions

---

## Project Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD deployment configuration
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthScreen.tsx      # Sign-in and sign-up interface
│   │   ├── dashboards/
│   │   │   ├── AdminDashboard.tsx   # Administration control panel
│   │   │   ├── HomeDashboard.tsx    # General landing dashboard
│   │   │   ├── TraineeDashboard.tsx # Trainee module & progress interface
│   │   │   └── TrainerDashboard.tsx # Trainer courses & grading view
│   │   └── layout/
│   │       ├── LandingPage.tsx     # Public welcome screen
│   │       └── Layout.tsx          # Navigation shell and app wrapper
│   ├── context/
│   │   └── AuthContext.tsx         # User authentication and session context
│   ├── lib/
│   │   ├── firebase.ts             # Firebase client SDK initialization
│   │   └── storage.ts              # Firebase Storage helper methods
│   ├── App.tsx                     # Route management and application root
│   ├── index.css                   # Global styles
│   ├── main.tsx                    # Application DOM mount entry
│   └── types.ts                    # Global TypeScript interfaces
├── .env.example                    # Environment variable template
├── firebase-blueprint.json         # Firebase resource mapping
├── firestore.rules                 # Cloud Firestore security rules
├── index.html                      # HTML index
├── package.json                    # Project dependencies and run scripts
├── tsconfig.json                   # TypeScript build settings
└── vite.config.ts                  # Vite build tool configuration
