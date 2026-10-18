
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  deleteQuestion,
  getQuestions,
} from "../utils/storage";

export default function Practice() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load questions from MongoDB when the page opens
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        setError("");

        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError(
          "Could not load questions. Please check that your backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  // Search and filter questions
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return questions.filter((q) => {
      const matchesSearch =
        `${q.title || ""} ${q.answer || ""} ${q.topic || ""} ${
          q.notes || ""
        }`
          .toLowerCase()
          .includes(term);

      return (
        matchesSearch &&
        (category === "All" || q.category === category) &&
        (difficulty === "All" || q.difficulty === difficulty)
      );
    });
  }, [questions, search, category, difficulty]);

  // Delete a question from MongoDB
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteQuestion(id);

      setQuestions((currentQuestions) =>
        currentQuestions.filter((q) => q.id !== id)
      );

      if (expanded === id) {
        setExpanded(null);
      }
    } catch (err) {
      console.error("Failed to delete question:", err);
      alert("Could not delete the question. Please try again.");
    }
  }

  return (
    <div className="page-content">
      <div className="section-heading">
        <div>
          <h1>Question Library</h1>
          <p>
            Create, organize, update, and revise interview questions.
          </p>
        </div>

        <Link
          className="primary-button link-button"
          to="/questions/new"
        >
          <Plus size={17} /> Add Question
        </Link>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            aria-label="Search questions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or topics..."
          />
        </div>

        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>Technical</option>
          <option>HR</option>
          <option>Aptitude</option>
          <option>Project</option>
        </select>

        <select
          aria-label="Filter by difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading questions...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <h2>Unable to load questions</h2>
          <p>{error}</p>
          <button
            className="secondary-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="results-label">
            {filtered.length} question
            {filtered.length === 1 ? "" : "s"} found
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={42} />

              <h2>
                {questions.length
                  ? "No matching questions"
                  : "Your library is empty"}
              </h2>

              <p>
                {questions.length
                  ? "Try changing your search or filters."
                  : "Add your first interview question to get started."}
              </p>

              {!questions.length && (
                <Link
                  className="primary-button link-button"
                  to="/questions/new"
                >
                  <Plus size={17} /> Add Your First Question
                </Link>
              )}
            </div>
          ) : (
            <div className="question-list">
              {filtered.map((q) => (
                <article className="question-card" key={q.id}>
                  <div className="question-card-top">
                    <div className="tag-row">
                      <span className="tag">{q.category}</span>

                      <span
                        className={`tag difficulty-${(
                          q.difficulty || "Medium"
                        ).toLowerCase()}`}
                      >
                        {q.difficulty || "Medium"}
                      </span>

                      {q.topic && (
                        <span className="tag">{q.topic}</span>
                      )}
                    </div>

                    <span className="question-status">
                      {q.status || "Not Started"}
                    </span>
                  </div>

                  <h3>{q.title}</h3>

                  {expanded === q.id && (
                    <div className="answer-panel">
                      <strong>Answer / Study notes</strong>
                      <p>{q.answer || "No answer added yet."}</p>

                      {q.notes && (
                        <>
                          <strong>Additional notes</strong>
                          <p>{q.notes}</p>
                        </>
                      )}
                    </div>
                  )}

                  <div className="question-actions">
                    <button
                      className="secondary-button"
                      onClick={() =>
                        setExpanded(
                          expanded === q.id ? null : q.id
                        )
                      }
                    >
                      {expanded === q.id ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}

                      {expanded === q.id
                        ? "Hide answer"
                        : "View answer"}
                    </button>

                    <Link
                      className="secondary-button link-button"
                      to={`/questions/${q.id}/edit`}
                    >
                      <Pencil size={16} /> Edit
                    </Link>

                    <button
                      className="danger-button"
                      onClick={() => handleDelete(q.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
