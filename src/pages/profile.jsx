
import { useState } from "react";
import { Save, UserRound } from "lucide-react";
import { getProfile, saveProfile } from "../utils/storage";

export default function Profile() {
  const [profile, setProfile] = useState(getProfile);
  const [message, setMessage] = useState("");

  function update(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    saveProfile(profile);
    setMessage("Profile saved successfully!");
  }

  return (
    <div className="page-content">
      <div className="section-heading">
        <div>
          <h1>My Profile</h1>
          <p>Manage your career goals and technical skills.</p>
        </div>
      </div>

      <form className="form-card profile-form" onSubmit={handleSubmit}>
        <div className="profile-heading">
          <div className="stat-icon blue"><UserRound size={26} /></div>
          <div>
            <h2>Career Preferences</h2>
            <p>Update your information below.</p>
          </div>
        </div>

        <label htmlFor="profile-name">Your name</label>
        <input
          id="profile-name"
          value={profile.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Enter your name"
          maxLength={80}
        />

        <label htmlFor="target-role">Target job role</label>
        <select
          id="target-role"
          value={profile.targetRole}
          onChange={(e) => update("targetRole", e.target.value)}
        >
          <option>MERN Developer</option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Software Engineer</option>
          <option>Embedded Engineer</option>
          <option>IoT Engineer</option>
        </select>

        <label htmlFor="target-company">Target company</label>
        <input
          id="target-company"
          value={profile.targetCompany}
          onChange={(e) => update("targetCompany", e.target.value)}
          placeholder="Enter your target company"
          maxLength={100}
        />

        <label htmlFor="profile-skills">Technical skills</label>
        <textarea
          id="profile-skills"
          rows={4}
          value={profile.skills}
          onChange={(e) => update("skills", e.target.value)}
          placeholder="e.g. React, Node.js, MongoDB, C, ESP32"
          maxLength={2000}
        />

        <button className="primary-button" type="submit">
          <Save size={17} /> Save Profile
        </button>

        {message && <p className="success-text" role="status">{message}</p>}
      </form>
    </div>
  );
}
