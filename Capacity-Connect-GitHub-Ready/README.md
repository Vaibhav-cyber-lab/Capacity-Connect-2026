# Capacity Connect

A modern, role-based Learning Management & Capacity Building Platform connecting **Trainees, Trainers, and Administrators**.

## ✨ Highlights

- Responsive landing page and authentication experience
- Role-based dashboards for trainees, trainers, and admins
- Course catalogue and course management
- Learning materials and assessments
- Progress, scores, feedback, evaluations, and competency tracking
- Announcements and certification tracking
- Local-first demo mode using browser `localStorage`
- Optional Firebase/Firestore integration
- Mobile-friendly sidebar and dashboard UI
- GitHub Pages deployment workflow included

## 🧱 Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Recharts
- Firebase / Firestore (optional cloud sync)

## 🚀 Run locally

### 1. Prerequisites

Install Node.js 20+ (Node.js 22 is recommended).

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite (normally `http://localhost:3000`).

### 4. Validate before publishing

```bash
npm run typecheck
npm run build
```

## 🔐 Authentication & data notes

The repository is configured to run in **local demo mode by default**. Demo account data is stored in the browser and password values are represented by SHA-256 hashes rather than plaintext.

This is suitable for a prototype/demo, **not production authentication**.

For a production release, replace the prototype authentication flow with Firebase Authentication (or another managed identity provider), add role-based Firestore Security Rules, and move privileged operations to trusted server-side code.

Firebase cloud sync is intentionally disabled unless `VITE_FIREBASE_*` values are supplied. This prevents an accidentally published prototype from writing to an unprotected database.

## ☁️ Optional Firebase setup

1. Create/select a Firebase project.
2. Register a Web App in Firebase.
3. Enable the services you actually need.
4. Copy `.env.example` to `.env.local`.
5. Fill in the Firebase web-app values.
6. Set `VITE_FIREBASE_DATABASE_ID` to your Firestore database ID. Use `(default)` for the default database.
7. Do **not** put server secrets or Gemini/API secrets in `VITE_*` variables.
8. Before enabling cloud sync for real users, implement Firebase Authentication and role-aware Firestore rules.

> Firebase web configuration values are client-side identifiers. They are not a substitute for Firestore Security Rules or Authentication.

## 📦 Project structure

```text
src/
├── components/
│   ├── auth/
│   ├── dashboards/
│   └── layout/
├── context/
├── lib/
│   ├── firebase.ts
│   └── storage.ts
├── App.tsx
├── main.tsx
├── index.css
└── types.ts
```

## 🌐 Deploy with GitHub Pages

A GitHub Actions workflow is already included at `.github/workflows/deploy.yml`.

### First upload the project to GitHub

1. Create a new repository on GitHub, for example `capacity-connect`.
2. Keep the repository **public** if this is for a hackathon/demo and you want an easy public showcase.
3. Do **not** upload `.env.local`, API keys, passwords, or service-account JSON files.
4. Upload/push the project files to the `main` branch.

Using Git from the project folder:

```bash
git init
git add .
git commit -m "Initial Capacity Connect release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/capacity-connect.git
git push -u origin main
```

### Publish

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the **Actions** tab).
5. Wait for **Deploy to GitHub Pages** to finish.
6. GitHub will show the deployed site URL under **Settings → Pages**.

The included workflow automatically builds the Vite app and sets the repository base path, so you do not need to hard-code the repository name in `vite.config.ts`.

## 🔁 Updating the live site

After the first deployment:

```bash
git add .
git commit -m "Update Capacity Connect"
git push
```

GitHub Actions will rebuild and redeploy the site automatically.

## 🧪 Troubleshooting

### Blank page after deployment

- Confirm the GitHub Pages workflow completed successfully.
- Hard-refresh the browser.
- Check the browser console for missing assets.
- Make sure deployment is from the `main` branch and uses GitHub Actions.

### Firebase errors

If you do not need cloud sync, remove/leave unset the `VITE_FIREBASE_*` variables and the app will stay in local demo mode.

If you do need Firebase:
- Verify the Firebase project values.
- Verify the Firestore database ID.
- Check Firestore Security Rules.
- Configure Firebase Authentication before exposing user data publicly.

## 🎯 Hackathon/SIH demo checklist

Before your final presentation:

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Test trainee, trainer, and admin flows
- [ ] Test mobile layout
- [ ] Remove personal/test data
- [ ] Confirm no `.env.local` or secret files are committed
- [ ] Verify the public deployment URL in an incognito window
- [ ] Add screenshots/demo video to the GitHub README
- [ ] Add the deployed URL and GitHub repository URL to your SIH presentation

## License

Add the license required by your team/institution before public distribution.
