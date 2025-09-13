import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import StatusBadge from "./StatusBadge";
import FollowUpTag from "./FollowUpTag";



const LABELS = {
  applied: "Applied", oa: "OA",
  interview: "Interview", offer: "Offer",
  rejected: "Rejected", ghosted: "No Response",
};
const STATUS_ORDER = ["applied","interview","offer","rejected","oa","ghosted"];

function Card({ a, onChangeStatus }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 10, background: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <strong>{a.company}</strong>
        <StatusBadge value={a.status} />
      </div>
      <div style={{ color: "#333" }}>{a.role}</div>
      <div style={{ fontSize: 12, color: "#666" }}>Applied: {a.date_applied}</div>
      <div style={{ marginTop: 6 }}>
        <FollowUpTag dateStr={a.next_followup_on} />
      </div>
      <div style={{ marginTop: 8 }}>
        <select
          value={a.status}
          onChange={(e) => onChangeStatus(a.id, e.target.value)}
          style={{ padding: 6, borderRadius: 8 }}
        >
          {STATUS_ORDER.map(s => <option key={s} value={s}>{LABELS[s]}</option>)}
        </select>
      </div>
    </div>
  );
}

export default function Applications() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [kanban, setKanban] = useState(true);

  async function load() {
    try { const r = await api.get("/applications/"); setRows(r.data); }
    catch { setRows([]); }
  }
  useEffect(() => { load(); }, []);

  async function onChangeStatus(id, status) {
    const item = rows.find(r => r.id === id);
    if (!item) return;
    await api.put(`/applications/${id}/`, { ...item, status });
    load();
  }

  const filtered = useMemo(() => rows.filter(a => {
    const okStage = stage === "all" ? true : a.status === stage;
    const t = q.trim().toLowerCase();
    const okQ = !t ? true :
      (a.company?.toLowerCase().includes(t) || a.role?.toLowerCase().includes(t));
    return okStage && okQ;
  }), [rows, q, stage]);

  const groups = useMemo(() => {
    const map = Object.fromEntries(STATUS_ORDER.map(s => [s, []]));
    for (const a of filtered) (map[a.status] ?? (map[a.status] = [])).push(a);
    return map;
  }, [filtered]);

  return (
    <div>
      <h2>Applications</h2>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <input
          placeholder="Search company or role"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", minWidth: 260 }}
        />
        <select value={stage} onChange={(e) => setStage(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
          <option value="all">All stages</option>
          {STATUS_ORDER.map(s => <option key={s} value={s}>{LABELS[s]}</option>)}
        </select>
        <button onClick={() => setKanban(!kanban)}>{kanban ? "List View" : "Kanban View"}</button>
      </div>

      {kanban ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {["applied","interview","offer"].map(col => (
            <div key={col} style={{ background: "#f7f8fa", borderRadius: 12, padding: 10 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{LABELS[col]}</div>
              <div style={{ display: "grid", gap: 8 }}>
                {groups[col].map(a => (
                  <Card key={a.id} a={a} onChangeStatus={onChangeStatus} />
                ))}
              </div>
            </div>
          ))}
          <div style={{ background: "#f7f8fa", borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Other</div>
            <div style={{ display: "grid", gap: 8 }}>
              {filtered.filter(a => !["applied","interview","offer"].includes(a.status))
                .map(a => <Card key={a.id} a={a} onChangeStatus={onChangeStatus} />)}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {filtered.map(a => <Card key={a.id} a={a} onChangeStatus={onChangeStatus} />)}
        </div>
      )}
    </div>
  );
}
