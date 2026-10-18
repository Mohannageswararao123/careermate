
import api from "./api";

// Normalize MongoDB questions for React
function normalizeQuestion(question) {
  return {
    ...question,
    id: question._id,
  };
}

// Get all questions from MongoDB
export async function getQuestions() {
  const response = await api.get("/questions");
  return response.data.map(normalizeQuestion);
}

// Get one question
export async function getQuestion(id) {
  const response = await api.get(`/questions/${id}`);
  return normalizeQuestion(response.data);
}

// Create a question in MongoDB
export async function createQuestion(data) {
  const response = await api.post("/questions", data);
  return normalizeQuestion(response.data);
}

// Update an existing question
export async function updateQuestion(id, data) {
  const response = await api.put(`/questions/${id}`, data);
  return normalizeQuestion(response.data);
}

// Delete a question
export async function deleteQuestion(id) {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
}

// Update preparation status
export async function updateQuestionStatus(id, status) {
  return updateQuestion(id, { status });
}

// Profile remains in localStorage for now
const PROFILE_KEY = "careermate_profile";

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getProfile() {
  return readJSON(PROFILE_KEY, {
    name: "",
    targetRole: "MERN Developer",
    targetCompany: "",
    skills: "",
  });
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
