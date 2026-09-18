capacity-connect/
├── firebase-applet-config.json     # Firebase project configuration settings
├── firebase-blueprint.json         # Firestore database schemas and entities configuration
├── firestore.rules                 # Cloud Firestore security rules
├── package.json                    # Node dependencies and scripts
├── tsconfig.json                   # TypeScript compiler configuration
├── vite.config.ts                  # Vite build tool and proxy settings
├── .env.example                    # Environment variable template
├── .gitignore                      # Git ignored files and directories
├── server.js                       # Express and Gemini AI backend integration
└── src/
    ├── App.tsx                     # Main application routing and context root
    ├── index.css                   # Global Tailwind CSS entry styles
    ├── main.tsx                    # React DOM mount entry point
    ├── types.ts                    # Global TypeScript interfaces
    ├── context/
    │   └── AuthContext.tsx         # User authentication and session context state
    ├── lib/
    │   ├── api.ts                  # Frontend API client for backend and AI endpoints
    │   ├── firebase.ts             # Firebase initialization and Firestore instance
    │   └── storage.ts              # Local and real-time Firebase cloud sync storage manager
    └── components/
        ├── auth/
        │   └── AuthScreen.tsx      # Unified sign-in and account registration screen
        ├── layout/
        │   ├── Footer.tsx          # Application footer layout component
        │   ├── Header.tsx          # Navigation header shell
        │   ├── LandingPage.tsx     # Public welcome showcase screen
        │   └── Layout.tsx          # Portal layout wrapper shell
        └── dashboards/
            ├── AdminDashboard.tsx   # System management, roster, and announcements
            ├── HomeDashboard.tsx    # Role-based main navigation hub and analytics
            ├── TraineeDashboard.tsx # Course catalog, quizzes, and digital certificates
            └── TrainerDashboard.tsx # Course management, materials upload, and evaluation
