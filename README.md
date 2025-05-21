
---

# AI Study Assistant

**AI Study Assistant** is an AI-powered platform where users can upload their lecture materials and instantly:

* 📄 **Summarize** content
* 🧠 Generate **interactive flashcards**
* 📝 Take **interactive quizzes**

All features are **personalized** and powered by advanced AI (GPT-4o), tailored to the uploaded lecture materials.

---

## 🌐 Features

* Upload lecture materials (PDF, text)
* AI-generated summary of lectures
* Flashcards with flip-to-reveal interaction
* Quizzes with instant feedback and difficulty levels
* Simple, modern UI built with React + Tailwind CSS

---

## 🛠️ Tech Stack

### Backend

* Node.js + Express
* PostgreSQL + Sequelize
* Multer (file upload handling)
* OpenAI GPT-4o API

### Frontend

* React + Vite
* Tailwind CSS

---

## 📁 Environment Variables

Create a `.env` file in the backend root with the following:

```env
OPENAI_API_KEY=your_openai_key
PORT=your_port
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_postgresql_connection_url
```

---

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd AI-Powered-Study-assist/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   nodemon server.js
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd AI-Powered-Study-assist/FrontEnd/ai-study-assistant
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend app:

   ```bash
   npm run dev
   ```

---

## 📬 Contributions

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

