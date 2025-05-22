
# 🔍 ReviewLens

**ReviewLens** is an AI-powered code review tool that integrates seamlessly with public GitHub repositories. Just paste the repository URL and let the AI analyze, highlight, and comment on your code with precision.
---

## 🚀 Features

- ✅ **AI Code Review**: Get intelligent suggestions and highlights for each file.
- 📂 **Repo Explorer**: Navigate through your repo’s file structure effortlessly.
- 🔍 **Line-by-Line Feedback**: View line-specific comments in a beautiful dialog UI.
- 📊 **Daily Limits**: Review up to 5 files per day (customizable).
- 💡 **Syntax Highlighting**: Read clean, color-coded code using modern syntax themes.
- 🌐 **No Setup Required**: Works instantly with public GitHub repositories.

---

## 🖥️ Demo

Try it live: [https://review-lens.vercel.app](https://review-lens.vercel.app)

---

## 🧰 Tech Stack

- **Next.js** (App Router)
- **React** & **TypeScript**
- **TailwindCSS**
- **Clerk** (for Authentication)
- **ShadCN UI**
- **GitHub API**
- **Gemini** (AI Review Engine)

---

## 🧪 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/reviewlens.git
cd reviewlens
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
OPENAI_API_KEY=your_openai_key
```

### 4. Run the development server

```bash
npm run dev
```

---

## ✨ Usage

1. Sign in using your account.
2. Enter a public GitHub repo URL (e.g., `https://github.com/vercel/next.js`).
3. Select a file and click **Review File**.
4. View AI-generated feedback and highlighted issues.
