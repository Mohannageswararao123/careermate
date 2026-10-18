
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CirclePlus,
  ClipboardCheck,
  UserRound,
  GraduationCap,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/practice", label: "Question Library", icon: BookOpen },
  { to: "/questions/new", label: "Add Question", icon: CirclePlus },
  { to: "/history", label: "Preparation Tracker", icon: ClipboardCheck },
  { to: "/profile", label: "My Profile", icon: UserRound },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={25} />
        </div>
        <div>
          <h2>CareerMate</h2>
          <p>Career preparation</p>
        </div>
      </div>

      <p className="sidebar-label">WORKSPACE</p>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-icon">
          <GraduationCap size={20} />
        </div>
        <div>
          <strong>Keep learning!</strong>
          <p>One question at a time.</p>
        </div>
      </div>
    </aside>
  );
}
