
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, CheckCircle2, Clock3, CirclePlus, ArrowRight,
} from "lucide-react";
import { getQuestions } from "../utils/storage";

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);

useEffect(() => {
  async function loadQuestions() {
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
  }

  loadQuestions();
}, []);
  const completed = questions.filter((q) => q.status === "Completed").length;
  const inProgress = questions.filter((q) => q.status === "In Progress").length;
  const technical = questions.filter((q) => q.category === "Technical").length;
  const recent = [...questions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5);

  const stats = [
    { label: "Total Questions", value: questions.length, icon: BookOpen, color: "blue" },
    { label: "Technical Questions", value: technical, icon: Clock3, color: "purple" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "green" },
    { label: "In Progress", value: inProgress, icon: Clock3, color: "orange" },
  ];

  return (
    <div className="page-content">
      <div className="welcome-banner">
        <div>
          <p className="welcome-eyebrow">YOUR CAREER WORKSPACE</p>
          <h1>Welcome to CareerMate!</h1>
          <p>Organize your interview preparation, one question at a time.</p>
          <Link to="/questions/new" className="primary-button link-button">
            <CirclePlus size={17} /> Add a Question
          </Link>
        </div>
        <div className="welcome-art">
          <BookOpen size={76} strokeWidth={1.3} />
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Preparation Overview</h2>
          <p>Track your progress at a glance.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <article className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}><Icon size={23} /></div>
            <p>{label}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="section-heading recent-heading">
        <div>
          <h2>Recently Added Questions</h2>
          <p>Your latest preparation materials.</p>
        </div>
        <Link className="view-all-link" to="/practice">
          View library <ArrowRight size={16} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={40} />
          <h2>Start building your question library</h2>
          <p>Add interview questions and their answers to track your preparation.</p>
          <Link className="primary-button link-button" to="/questions/new">
            <CirclePlus size={17} /> Add First Question
          </Link>
        </div>
      ) : (
        <div className="recent-list">
          {recent.map((q) => (
            <div className="recent-item" key={q.id}>
              <div className="recent-item-icon"><BookOpen size={19} /></div>
              <div className="recent-item-content">
                <strong>{q.title}</strong>
                <p>{q.topic} · {q.category} · {q.difficulty}</p>
              </div>
              <span className="question-status">{q.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
