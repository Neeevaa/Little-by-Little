# 🌱 Little by Little — 14 Day Reset

A simple, interactive 14-day personal reset dashboard designed to help build consistent habits while balancing college, AI/ML learning, fitness, hydration, and skincare.

The idea is simple: **small, consistent actions lead to meaningful progress.**

## ✨ Features

### 📅 14-Day Reset Planner
- Organize and track your daily goals over 14 days.
- Follow a structured routine that fits around college hours.
- Monitor your progress through interactive checklists.

### 🤖 AI/ML Learning Tracker
- Follow a 14-day learning roadmap.
- Track daily learning milestones.
- Build consistency through small, manageable learning sessions.

### 💧 Hydration Tracker
- Track daily water intake.
- Update your hydration progress interactively.
- Build a consistent water-drinking habit.

### 🏃 Workout & Wellness
- Track daily workout and movement goals.
- Maintain a balanced routine alongside academic commitments.

### 🧴 Skincare Routine
- Morning niacinamide routine.
- Evening skincare routine.
- Scheduled salicylic acid nights.
- Track skincare consistency throughout the reset.

### 📝 Daily Reflection
- Review daily progress.
- Record reflections and stay accountable to your goals.

### 💾 Session-Based Progress
- Uses browser `sessionStorage` to store progress without requiring a backend.
- No account or login required.
- Progress can remain available during the current browser session.

> **Note:** Progress is session-based and may be cleared when the browser session ends. This project does not currently provide cloud synchronization or cross-device persistence.

## 🛠️ Tech Stack

- **React** — Component-based user interface
- **Vite** — Development server and build tool
- **JavaScript (JSX)** — Application logic
- **CSS** — Styling and responsive layout
- **Lucide React** — Icons
- **Web Storage API (`sessionStorage`)** — Client-side progress tracking

## 📂 Project Structure

```text
little-by-little-react-dashboard/
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── main.jsx
    └── styles.css
```

*The exact file structure may vary if the project is modified.*

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) — preferably an active LTS version
- npm, included with Node.js
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the repository

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your GitHub details.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 2. Open the project folder

```bash
cd YOUR_REPOSITORY
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

Vite generates the production-ready files in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## 🌐 Deployment on Vercel

This project can be deployed as a static React + Vite application.

1. Push the project to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com/).
3. Select **Add New → Project**.
4. Import your GitHub repository.
5. Configure the project using the following settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

6. Click **Deploy**.
7. Open the generated deployment URL to access your dashboard.

No backend or environment variables are required for the current client-side version.

## ⚙️ Customization

You can personalize the dashboard to fit your own routine.

- **Start date:** Update the `START_DATE` value in `src/main.jsx` if the project uses that configuration.
- **Daily schedule:** Modify the schedule data to match your college or work hours.
- **AI/ML roadmap:** Replace the learning milestones with your preferred topics.
- **Habits:** Adjust the habit checklist to match your goals.
- **Styling:** Update `src/styles.css` to customize colors, spacing, typography, and layout.

Check the existing source code before changing configuration values, since the implementation may evolve.

## 🔒 Data & Privacy

- No login or user account is required.
- Progress is stored locally in the browser's session storage.
- The current version does not require a database or backend API.
- Data is not automatically synchronized across browsers or devices.

Avoid storing sensitive personal information in the dashboard.

## 🎯 Project Goal

Little by Little is a small personal productivity project focused on making habit-building practical, visual, and achievable.

Rather than aiming for perfection, it encourages consistent progress across learning, health, and everyday routines.

**One day at a time. One habit at a time. Little by little. 🌱**

## 📄 License

You may add an appropriate license depending on how you intend to share or distribute this project.
