
import { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ExternalLink } from "lucide-react";
import { getQuestions, updateQuestionStatus } from "../utils/storage";

export default function History() {
  const [questions, setQuestions] = useState(getQuestions());
  const [filter, setFilter] = useState("All");

  const filtered = questions.filter(
    (q) => filter === "All" || q.status === filter
  );

  function changeStatus(id, status) {
    updateQuestionStatus(id, status);
    setQuestions(getQuestions());
  }

  return (
    <div className="page-content">
      <div className="section-heading">
        <div>
          <h1>Preparation Tracker</h1>
          <p>Monitor the questions you have studied and revised.</p>
        </div>
      </div>

      <div className="tracker-summary">
        {["Not Started", "In Progress", "Completed"].map((status) => (
          <div className="tracker-count" key={status}>
            <span>{status}</span>
            <strong>{questions.filter((q) => q.status === status).length}</strong>
          </div>
        ))}
      </div>

      <div className="filter-bar tracker-filter">
        <label htmlFor="tracker-filter">Filter status</label>
        <select
          id="tracker-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <ClipboardCheck size={42} />
          <h2>No questions to track</h2>
          <p>Add questions to your library to start tracking preparation.</p>
          <Link to="/questions/new" className="primary-button link-button">
            Add a Question
          </Link>
        </div>
      ) : (
        <div className="question-list">
          {filtered.map((q) => (
            <article className="question-card tracker-card" key={q.id}>
              <div className="tracker-question">
                <div>
                  <h3>{q.title}</h3>
                  <p>{q.topic} · {q.category} · {q.difficulty}</p>
                </div>
                <select
                  aria-label={`Preparation status for ${q.title}`}
                  value={q.status}
                  onChange={(e) => changeStatus(q.id, e.target.value)}
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <Link className="view-all-link" to={`/questions/${q.id}/edit`}>
                Edit question <ExternalLink size={15} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
