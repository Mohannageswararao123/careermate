
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import {
  createQuestion,
  getQuestion,
  updateQuestion,
} from "../utils/storage";

const initialForm = {
  title: "",
  answer: "",
  category: "Technical",
  topic: "JavaScript",
  difficulty: "Medium",
  status: "Not Started",
  notes: "",
};

export default function AddQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Load the question when editing an existing question
  useEffect(() => {
    let cancelled = false;

    async function loadQuestion() {
      if (!id) {
        setForm(initialForm);
        return;
      }

      try {
        const existing = await getQuestion(id);

        if (!cancelled) {
          setForm({
            ...initialForm,
            ...existing,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load question. Please try again."
          );
        }
      }
    }

    loadQuestion();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function change(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.answer.trim()) {
      setError("Please enter both the question and its answer.");
      return;
    }

    const data = {
      ...form,
      title: form.title.trim(),
      answer: form.answer.trim(),
      topic: form.topic.trim(),
      notes: form.notes.trim(),
    };

    try {
      setSaving(true);

      if (id) {
        await updateQuestion(id, data);
      } else {
        await createQuestion(data);
      }

      // Navigate in the same tab after saving successfully
      navigate("/practice");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the question. Check your backend connection."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-content">
      <button
        type="button"
        className="text-button"
        onClick={() => navigate("/practice")}
      >
        <ArrowLeft size={17} />
        Back to Question Library
      </button>

      <div className="section-heading">
        <div>
          <h1>{id ? "Edit Question" : "Add New Question"}</h1>
          <p>Organize your interview preparation materials.</p>
        </div>
      </div>

      <form
        className="form-card question-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="question-title">
          Interview question *
        </label>
        <textarea
          id="question-title"
          rows={3}
          value={form.title}
          onChange={(e) => change("title", e.target.value)}
          placeholder="Enter your interview question"
          required
        />

        <label htmlFor="question-answer">
          Answer / Study notes *
        </label>
        <textarea
          id="question-answer"
          rows={6}
          value={form.answer}
          onChange={(e) => change("answer", e.target.value)}
          placeholder="Write the answer in your own words"
          required
        />

        <div className="form-grid">
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => change("category", e.target.value)}
            >
              <option>Technical</option>
              <option>HR</option>
              <option>Aptitude</option>
              <option>Project</option>
            </select>
          </div>

          <div>
            <label htmlFor="topic">Topic</label>
            <input
              id="topic"
              value={form.topic}
              onChange={(e) => change("topic", e.target.value)}
              placeholder="e.g. React, C, IoT"
              required
            />
          </div>

          <div>
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={form.difficulty}
              onChange={(e) => change("difficulty", e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="status">Preparation status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => change("status", e.target.value)}
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <label htmlFor="notes">Additional notes (optional)</label>
        <textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={(e) => change("notes", e.target.value)}
          placeholder="Examples, reminders, or revision notes"
        />

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/practice")}
          >
            Cancel
          </button>

          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >
            <Save size={17} />
            {saving
              ? "Saving..."
              : id
                ? "Save Changes"
                : "Add Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
