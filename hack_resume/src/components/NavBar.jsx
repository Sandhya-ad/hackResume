import { Link, useLocation } from "react-router-dom";

const Tab = ({ to, here, children }) => (
  <Link
    to={to}
    style={{
      padding: "8px 12px",
      borderRadius: 10,
      textDecoration: "none",
      color: "#111",
      background: here ? "#eef" : "transparent",
    }}
  >
    {children}
  </Link>
);

export default function NavBar() {
  const p = useLocation().pathname;
  return (
    <nav style={{ display: "flex", gap: 10, padding: 12, borderBottom: "1px solid #eee" }}>
      <Tab to="/" here={p === "/"}>Dashboard</Tab>
      <Tab to="/applications" here={p.startsWith("/applications")}>Applications</Tab>
      <Tab to="/applications/new" here={p === "/applications/new"}>+ New</Tab>
    </nav>
  );
}
