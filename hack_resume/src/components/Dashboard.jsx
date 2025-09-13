import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import dayjs from "dayjs";

export default function Dashboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/applications/").then(r => setRows(r.data)).catch(() => setRows([]));
  }, []);

  const counts = useMemo(() => rows.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1; return acc;
  }, {}), [rows]);

  const upcoming = useMemo(() => rows
    .filter(a => a.next_followup_on)
    .filter(a => {
      const d = dayjs(a.next_followup_on);
      const days = d.startOf("day").diff(dayjs().startOf("day"), "day");
      return !isNaN(days) && days <= 7;
    })
    .sort((a,b) => dayjs(a.next_followup_on) - dayjs(b.next_followup_on))
  , [rows]);

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.entries(counts).map(([k,v]) => (
          <div key={k} style={{ padding: 12, border: "1px solid #eee", borderRadius: 10, minWidth: 110 }}>
            <div style={{ fontSize: 12, color: "#666" }}>{k}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{v}</div>
          </div>
        ))}
      </div>

      <h3>Follow up in next 7 days</h3>
      {upcoming.length === 0 ? (
        <div style={{ color: "#666" }}>No upcoming follow-ups.</div>
      ) : (
        <ul>
          {upcoming.map(a => (
            <li key={a.id}>
              {a.company} — {a.role} — {a.next_followup_on}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
