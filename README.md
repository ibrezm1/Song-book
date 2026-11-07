# 🎵 Do-Re-Mi Kids - Fun Pitch & Ear Learning

An interactive, kid-friendly web application designed to help children develop their musical ear and learn pitch recognition ("Do Re Mi Fa Sol La Ti Do") through play, guided songs, and leveled ear-training quests.

Built with **React**, **TypeScript**, **Tailwind CSS**, and the browser's native **Web Audio API** (zero latency, no audio file downloads needed). Ready for 1-click deployment on **GitHub Pages**!

---

## ✨ Features

- **🪵 Rainbow Xylophone & 🔔 Magic Bells**:
  - Switch between warm wooden percussion and shimmering chime bells.
  - Realistic acoustic synthesis with fundamental frequencies and harmonic overtones.
  - Tactile physical keys sized proportionately from low to high pitch.
  - Standard kid-friendly Boomwhackers color coding (Red C4 up to Pink C5).
- **🔤 Flexible Note Display**:
  - Switch anytime between Solfège (**Do - Re - Mi**), English Letters (**C - D - E**), Numbers (**1 - 8**), or Dual (**Do + C**).
- **🎶 Mode 1: Free Jam & Song Book**:
  - Open free play for exploration.
  - Interactive **Song Book** with classics like *Twinkle Twinkle Little Star*, *Mary Had a Little Lamb*, *Row Row Row Your Boat*, *Do-Re-Mi Scale Ladder*, and *Ode to Joy*. Notes light up step-by-step for the child to follow, with audio demo playback and celebratory confetti!
- **🪜 Mode 2: Pitch Ladder**:
  - Visual stair-step pitch ladder showing children how pitch rises and falls.
  - Interactive buttons to climb up, slide down, and compare high vs low pitches.
- **🎯 Mode 3: Ear Quiz Quest (5 Leveled Challenges)**:
  - **Level 1: High or Low?** (Ear foundation: which of the 2 notes was higher?).
  - **Level 2: Do, Re, Mi Master** (3-note identification).
  - **Level 3: Pentatonic Detective** (5-note identification: Do, Re, Mi, Sol, La).
  - **Level 4: Full Octave Rainbow** (Complete 8-note pitch identification).
  - **Level 5: Echo Melody** (Sequence memory: listen to secret melodies and play them back).
- **⭐ Star Rewards & Progress**:
  - 1 to 3 stars awarded per level based on accuracy, with encouraging retry nudges (no punishing penalties) and `canvas-confetti` celebrations.
  - Progress automatically saved to `localStorage`.
- **📱 Responsive & Touch Optimized**:
  - Works on iPads, tablets, smartphones, and desktop computers (with keyboard number 1-8 shortcuts).

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deploying to GitHub Pages (`github.io`)

This project is configured to deploy directly to GitHub Pages using GitHub Actions:

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Do-Re-Mi Kids app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** ➔ **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push to `main` (or run the workflow manually under the **Actions** tab). Your app will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`!
